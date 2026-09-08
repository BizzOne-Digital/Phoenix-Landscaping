import { connectToDatabase } from '@/lib/db/mongoose';
import { SiteSettings, SITE_SETTINGS_KEY } from '@/lib/db/models';
import { requireAdmin, revalidatePublicContent } from '@/lib/api/guard';
import { serializeDoc } from '@/lib/api/crud';
import { badRequest, ok, serverError, unprocessable } from '@/lib/api/http';
import { siteSettingsSchema } from '@/lib/api/schemas';
import { parseBody } from '@/lib/api/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Business information is a singleton document keyed 'default'. */
export async function GET() {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    await connectToDatabase();
    const doc = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
    return ok({ success: true, item: doc ? serializeDoc(doc) : null });
  } catch (error) {
    return serverError('admin/settings', error);
  }
}

/** Business information affects every page, so it is admin-only. */
export async function PUT(request: Request) {
  const guard = requireAdmin(['admin']);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest();
  }

  const parsed = parseBody(siteSettingsSchema, body, { partial: true });
  if (!parsed.ok) return unprocessable('Please correct the highlighted fields.', parsed.errors);
  if (Object.keys(parsed.data).length === 0) return badRequest('Nothing to update.');

  try {
    await connectToDatabase();
    const doc = await SiteSettings.findOneAndUpdate(
      { key: SITE_SETTINGS_KEY },
      { $set: parsed.data, $setOnInsert: { key: SITE_SETTINGS_KEY } },
      { new: true, upsert: true, runValidators: true },
    ).lean();

    revalidatePublicContent();
    return ok({ success: true, item: serializeDoc(doc) });
  } catch (error) {
    return serverError('admin/settings', error);
  }
}
