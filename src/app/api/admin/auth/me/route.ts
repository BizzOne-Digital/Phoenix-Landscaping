import { requireAdmin } from '@/lib/api/guard';
import { ok } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;

  const { email, name, role } = guard.session;
  return ok({ success: true, user: { email, name, role } });
}
