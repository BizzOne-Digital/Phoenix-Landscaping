import type { SortOrder } from 'mongoose';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongoose';
import { ADMIN_ROLES, type AdminRole, type AnyContentModel } from '@/lib/db/models';
import { requireAdmin, revalidatePublicContent } from '@/lib/api/guard';
import {
  badRequest,
  conflict,
  notFound,
  ok,
  serverError,
  unprocessable,
} from '@/lib/api/http';
import { parseBody, type Schema } from '@/lib/api/validate';
import { deleteReplacedUpload, deleteStoredUpload } from '@/lib/uploads.server';

export type RouteContext = { params: Record<string, string> };

export type CrudConfig = {
  /** Mongoose model to operate on. */
  model: AnyContentModel;
  /** Used in server-side error logs. */
  scope: string;
  /** Validation schema for POST (full) and PATCH (partial). */
  schema: Schema;
  /** Default listing order. */
  sort?: Record<string, SortOrder>;
  /** Roles allowed to mutate. Defaults to admin + editor. */
  writeRoles?: readonly AdminRole[];
  /**
   * Dot paths holding an image URL (`'image.src'`, `'image'`). Managed
   * `/api/uploads/...` binaries at these paths are cleaned up on replace
   * and on delete.
   */
  imagePaths?: readonly string[];
  /** Field carrying a unique index, so a duplicate returns 409 not 500. */
  uniqueField?: string;
};

type PlainDoc = Record<string, unknown>;

function getPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || typeof value !== 'object') return undefined;
    return (value as PlainDoc)[key];
  }, source);
}

/** Strips Mongo internals and makes the document JSON-safe for the dashboard. */
export function serializeDoc(doc: PlainDoc | null): PlainDoc | null {
  if (!doc) return null;

  const { _id, __v, ...rest } = doc as PlainDoc & { _id?: unknown; __v?: unknown };
  const output: PlainDoc = { id: String(_id) };

  for (const [key, value] of Object.entries(rest)) {
    if (value instanceof Date) {
      output[key] = value.toISOString();
    } else if (value && typeof value === 'object' && '_id' in (value as PlainDoc)) {
      const { _id: nestedId, ...nested } = value as PlainDoc;
      void nestedId;
      output[key] = nested;
    } else {
      output[key] = value as unknown;
    }
  }

  return output;
}

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: number }).code === 11000,
  );
}

async function readJson(request: Request): Promise<unknown | undefined> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/** GET (list) + POST (create) handlers for `/api/admin/<collection>`. */
export function createCollectionHandlers(config: CrudConfig) {
  const { model, scope, schema, sort = { order: 1, createdAt: 1 } } = config;
  const writeRoles = config.writeRoles ?? ADMIN_ROLES;

  async function GET() {
    const guard = requireAdmin();
    if (!guard.ok) return guard.response;

    try {
      await connectToDatabase();
      const docs = await model.find({}).sort(sort).lean();
      return ok({ success: true, items: docs.map((doc) => serializeDoc(doc as PlainDoc)) });
    } catch (error) {
      return serverError(scope, error);
    }
  }

  async function POST(request: Request) {
    const guard = requireAdmin(writeRoles);
    if (!guard.ok) return guard.response;

    const body = await readJson(request);
    if (body === undefined) return badRequest();

    const parsed = parseBody(schema, body);
    if (!parsed.ok) return unprocessable('Please correct the highlighted fields.', parsed.errors);

    try {
      await connectToDatabase();
      const created = await model.create(parsed.data);
      revalidatePublicContent();
      return ok(
        { success: true, item: serializeDoc(created.toObject() as PlainDoc) },
        { status: 201 },
      );
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return conflict(
          config.uniqueField
            ? `Another entry already uses that ${config.uniqueField}.`
            : undefined,
        );
      }
      return serverError(scope, error);
    }
  }

  return { GET, POST };
}

/** GET / PATCH / DELETE handlers for `/api/admin/<collection>/[id]`. */
export function createItemHandlers(config: CrudConfig) {
  const { model, scope, schema } = config;
  const writeRoles = config.writeRoles ?? ADMIN_ROLES;
  const imagePaths = config.imagePaths ?? [];

  function resolveId(context: RouteContext): string | null {
    const id = context.params.id;
    return mongoose.isValidObjectId(id) ? id : null;
  }

  async function GET(_request: Request, context: RouteContext) {
    const guard = requireAdmin();
    if (!guard.ok) return guard.response;

    const id = resolveId(context);
    if (!id) return notFound();

    try {
      await connectToDatabase();
      const doc = await model.findById(id).lean();
      if (!doc) return notFound();
      return ok({ success: true, item: serializeDoc(doc as PlainDoc) });
    } catch (error) {
      return serverError(scope, error);
    }
  }

  async function PATCH(request: Request, context: RouteContext) {
    const guard = requireAdmin(writeRoles);
    if (!guard.ok) return guard.response;

    const id = resolveId(context);
    if (!id) return notFound();

    const body = await readJson(request);
    if (body === undefined) return badRequest();

    const parsed = parseBody(schema, body, { partial: true });
    if (!parsed.ok) return unprocessable('Please correct the highlighted fields.', parsed.errors);
    if (Object.keys(parsed.data).length === 0) return badRequest('Nothing to update.');

    try {
      await connectToDatabase();

      const previous = (await model.findById(id).lean()) as PlainDoc | null;
      if (!previous) return notFound();

      const updated = await model
        .findByIdAndUpdate(id, { $set: parsed.data }, { new: true, runValidators: true })
        .lean();
      if (!updated) return notFound();

      // Only once the new value is safely persisted.
      for (const path of imagePaths) {
        await deleteReplacedUpload(getPath(previous, path), getPath(updated, path));
      }

      revalidatePublicContent();
      return ok({ success: true, item: serializeDoc(updated as PlainDoc) });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return conflict(
          config.uniqueField
            ? `Another entry already uses that ${config.uniqueField}.`
            : undefined,
        );
      }
      return serverError(scope, error);
    }
  }

  async function DELETE(_request: Request, context: RouteContext) {
    const guard = requireAdmin(writeRoles);
    if (!guard.ok) return guard.response;

    const id = resolveId(context);
    if (!id) return notFound();

    try {
      await connectToDatabase();
      const doc = (await model.findByIdAndDelete(id).lean()) as PlainDoc | null;
      if (!doc) return notFound();

      for (const path of imagePaths) {
        await deleteStoredUpload(getPath(doc, path));
      }

      revalidatePublicContent();
      return ok({ success: true });
    } catch (error) {
      return serverError(scope, error);
    }
  }

  return { GET, PATCH, DELETE };
}
