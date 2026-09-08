import { getGallery } from '@/lib/content';
import { ok, serverError } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public, read-only gallery feed for the admin-managed job photos.
 * Returns image URLs and alt text only — no database internals.
 */
export async function GET() {
  try {
    const items = await getGallery();
    return ok({ success: true, items });
  } catch (error) {
    return serverError('api/gallery', error);
  }
}
