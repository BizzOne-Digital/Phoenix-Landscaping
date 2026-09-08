import { randomBytes } from 'node:crypto';
import { connectToDatabase } from '@/lib/db/mongoose';
import { StoredUpload } from '@/lib/db/models';
import {
  ALLOWED_IMAGE_TYPES,
  isManagedUploadUrl,
  parseUploadUrl,
} from '@/lib/uploads';

/**
 * Server-only upload helpers.
 *
 * Kept separate from `@/lib/uploads` so the pure path helpers there stay
 * importable from client components without pulling in Node or Mongoose.
 */

/**
 * Server-generated filename: `${Date.now()}-${randomHex}.${ext}`.
 * The client's original filename is never used, so it cannot smuggle a path.
 */
export function generateFilename(mimeType: string): string {
  const ext = ALLOWED_IMAGE_TYPES[mimeType];
  return `${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`;
}

/**
 * Removes the MongoDB binary behind a managed upload URL.
 *
 * Anything that is not a `/api/uploads/...` URL is left alone — bundled
 * photography under `/images/...` and legacy `/uploads/...` paths are not
 * ours to delete, and nothing is ever removed from the filesystem.
 */
export async function deleteStoredUpload(url: unknown): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;

  try {
    await connectToDatabase();
    const result = await StoredUpload.deleteOne({
      folder: parsed.folder,
      filename: parsed.filename,
    });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('[uploads] Could not delete stored upload:', error);
    return false;
  }
}

/**
 * Deletes the previous image only once the replacement is safely saved.
 * A no-op when the URL has not actually changed.
 */
export async function deleteReplacedUpload(
  previousUrl: unknown,
  nextUrl: unknown,
): Promise<void> {
  if (!isManagedUploadUrl(previousUrl)) return;
  if (previousUrl === nextUrl) return;
  await deleteStoredUpload(previousUrl);
}

