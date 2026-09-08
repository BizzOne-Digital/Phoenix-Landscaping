import { clearSessionCookie } from '@/lib/auth/session';
import { ok } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  clearSessionCookie();
  return ok({ success: true });
}
