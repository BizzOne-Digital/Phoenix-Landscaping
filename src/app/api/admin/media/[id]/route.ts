import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongoose';
import { StoredUpload } from '@/lib/db/models';
import { requireAdmin } from '@/lib/api/guard';
import { notFound, ok, serverError } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: { id: string } };

/**
 * Permanently removes a stored upload.
 *
 * Admin-only: content that still references the URL will fall back to the
 * placeholder, so this is not something an editor should do by accident.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const guard = requireAdmin(['admin']);
  if (!guard.ok) return guard.response;

  if (!mongoose.isValidObjectId(params.id)) return notFound();

  try {
    await connectToDatabase();
    const deleted = await StoredUpload.findByIdAndDelete(params.id).select('filename').lean();
    if (!deleted) return notFound();
    return ok({ success: true });
  } catch (error) {
    return serverError('admin/media/delete', error);
  }
}
