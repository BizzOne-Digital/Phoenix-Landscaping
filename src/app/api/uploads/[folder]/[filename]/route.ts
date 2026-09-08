import { connectToDatabase } from '@/lib/db/mongoose';
import { StoredUpload } from '@/lib/db/models';
import { isSafeFilename, isUploadFolder } from '@/lib/uploads';

/** Node runtime: streaming a MongoDB Buffer is not available on Edge. */
export const runtime = 'nodejs';

type RouteContext = { params: { folder: string; filename: string } };

/**
 * `.lean()` hands back the raw BSON value for a Buffer path, which is a
 * `Binary` wrapper rather than a Node Buffer. Normalise all three shapes.
 */
function toBuffer(value: unknown): Buffer | null {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);

  const wrapped = (value as { buffer?: unknown } | null)?.buffer;
  if (Buffer.isBuffer(wrapped)) return wrapped;
  if (wrapped instanceof Uint8Array) return Buffer.from(wrapped);

  return null;
}

function imageNotFound() {
  return new Response('Not found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

/**
 * GET /api/uploads/{folder}/{filename}
 *
 * Serves an admin-uploaded image straight out of MongoDB. Because the bytes
 * are in the database rather than on disk, these URLs keep working across
 * Vercel redeployments, cold starts and multiple serverless instances.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const folder = params.folder;

  let filename: string;
  try {
    filename = decodeURIComponent(params.filename);
  } catch {
    return imageNotFound();
  }

  // Folder allow-list, and a filename that cannot contain `..`, `/` or `\`.
  if (!isUploadFolder(folder) || !isSafeFilename(filename)) return imageNotFound();

  try {
    await connectToDatabase();
    const upload = await StoredUpload.findOne({ folder, filename })
      .select('data mimeType size')
      .lean();

    if (!upload) return imageNotFound();

    const body = toBuffer(upload.data);
    if (!body || body.byteLength === 0) return imageNotFound();

    return new Response(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': upload.mimeType || 'application/octet-stream',
        'Content-Length': String(body.byteLength),
        // Filenames are content-addressed by timestamp + random hex, so a
        // given URL always refers to the same bytes.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    // Never leak the database error to the client.
    console.error('[api/uploads] Could not serve upload:', error);
    return imageNotFound();
  }
}
