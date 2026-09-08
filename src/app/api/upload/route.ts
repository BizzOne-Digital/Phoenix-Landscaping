import { connectToDatabase } from '@/lib/db/mongoose';
import { StoredUpload } from '@/lib/db/models';
import { requireAdmin } from '@/lib/api/guard';
import { badRequest, ok, serverError, unprocessable } from '@/lib/api/http';
import {
  MAX_UPLOAD_BYTES,
  UPLOAD_FOLDERS,
  isAllowedImageType,
  isUploadFolder,
  uploadUrl,
} from '@/lib/uploads';
import { generateFilename } from '@/lib/uploads.server';

/** Node runtime: Buffers and the MongoDB driver are not available on Edge. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/upload
 *
 * FormData: `file` (image) and `folder` (one of UPLOAD_FOLDERS).
 * The binary is written to MongoDB — never to the filesystem — so uploaded
 * images survive redeployments and cold starts on serverless hosts.
 */
export async function POST(request: Request) {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest('Expected a multipart form upload.');
  }

  const folder = form.get('folder');
  if (!isUploadFolder(folder)) {
    return unprocessable(`Folder must be one of: ${UPLOAD_FOLDERS.join(', ')}.`, {
      folder: 'Unsupported folder.',
    });
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return unprocessable('Choose an image to upload.', { file: 'No file received.' });
  }

  // MIME type from the upload itself — the filename extension is not trusted.
  const mimeType = file.type;
  if (!isAllowedImageType(mimeType)) {
    return unprocessable('Only JPEG, PNG, WebP and GIF images can be uploaded.', {
      file: 'Unsupported image type.',
    });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return unprocessable('Images must be 8 MB or smaller.', { file: 'File is too large.' });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Re-check after reading: `size` is client-reported until this point.
    if (buffer.byteLength > MAX_UPLOAD_BYTES) {
      return unprocessable('Images must be 8 MB or smaller.', { file: 'File is too large.' });
    }

    const filename = generateFilename(mimeType);

    await connectToDatabase();
    await StoredUpload.create({
      folder,
      filename,
      mimeType,
      size: buffer.byteLength,
      data: buffer,
    });

    return ok({
      success: true,
      url: uploadUrl(folder, filename),
      filename,
      size: buffer.byteLength,
      folder,
    });
  } catch (error) {
    return serverError('api/upload', error);
  }
}
