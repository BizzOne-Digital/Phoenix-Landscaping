import type { FilterQuery } from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongoose';
import { StoredUpload, type StoredUploadDoc } from '@/lib/db/models';
import { requireAdmin } from '@/lib/api/guard';
import { ok, serverError } from '@/lib/api/http';
import { isUploadFolder, uploadUrl } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 60;

/**
 * GET /api/admin/media?folder=gallery&page=1
 *
 * Metadata only. The `data` Buffer is deliberately excluded from the
 * projection so listing a media library never pulls image binaries into
 * memory — previews are loaded by the browser from `/api/uploads/...`.
 */
export async function GET(request: Request) {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const folder = url.searchParams.get('folder');
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);

  const filter: FilterQuery<StoredUploadDoc> = {};
  if (folder && isUploadFolder(folder)) filter.folder = folder;

  try {
    await connectToDatabase();

    const [docs, total] = await Promise.all([
      StoredUpload.find(filter)
        .select('folder filename mimeType size createdAt updatedAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      StoredUpload.countDocuments(filter),
    ]);

    return ok({
      success: true,
      total,
      page,
      pageSize: PAGE_SIZE,
      items: docs.map((doc) => ({
        id: String(doc._id),
        folder: doc.folder,
        filename: doc.filename,
        mimeType: doc.mimeType,
        size: doc.size,
        url: isUploadFolder(doc.folder)
          ? uploadUrl(doc.folder, doc.filename)
          : `/api/uploads/misc/${doc.filename}`,
        createdAt: doc.createdAt?.toISOString() ?? null,
      })),
    });
  } catch (error) {
    return serverError('admin/media', error);
  }
}
