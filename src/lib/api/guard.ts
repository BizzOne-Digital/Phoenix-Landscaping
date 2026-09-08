import { revalidatePath, revalidateTag } from 'next/cache';
import { getAdminSession, type AdminSession } from '@/lib/auth/session';
import { ADMIN_ROLES, type AdminRole } from '@/lib/db/models';
import { forbidden, unauthorized } from '@/lib/api/http';

/** Cache tag every public content read is registered under. */
export const CMS_CACHE_TAG = 'phoenix-cms';

export type GuardResult =
  | { ok: true; session: AdminSession }
  | { ok: false; response: Response };

/**
 * Server-side authorisation for admin API routes.
 *
 * No session at all -> 401. A valid session without the required role -> 403.
 * Hiding controls in the dashboard UI is never the only check.
 */
export function requireAdmin(roles: readonly AdminRole[] = ADMIN_ROLES): GuardResult {
  let session: AdminSession | null = null;

  try {
    session = getAdminSession();
  } catch (error) {
    // A missing/short ADMIN_SESSION_SECRET makes every token unverifiable.
    console.error('[auth] Session could not be read:', error);
    return { ok: false, response: unauthorized() };
  }

  if (!session) return { ok: false, response: unauthorized() };
  if (!roles.includes(session.role)) return { ok: false, response: forbidden() };

  return { ok: true, session };
}

/**
 * Drops the cached public pages after a content change so the live site
 * reflects the edit without a redeploy.
 *
 * `revalidatePath('/', 'layout')` covers the nested routes but does not
 * reliably invalidate the home page itself, so `/` is revalidated explicitly
 * as well.
 */
export function revalidatePublicContent(): void {
  revalidateTag(CMS_CACHE_TAG);
  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
}
