import { connectToDatabase } from '@/lib/db/mongoose';
import { AdminUser, type AdminRole } from '@/lib/db/models';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { badRequest, ok, serverError, unauthorized } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Very small in-memory throttle. Serverless instances do not share this, so
 * it is a speed bump against a single noisy client rather than a full rate
 * limiter — the constant-time password check is the real defence.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 5 * 60 * 1000;

function throttled(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  const clientKey = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (throttled(clientKey)) {
    return unauthorized('Too many attempts. Please wait a few minutes and try again.');
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest();
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return badRequest('Enter your email address and password.');
  }

  try {
    await connectToDatabase();
    const user = await AdminUser.findOne({ email }).select('+passwordHash');

    // Deliberately identical response for "no such user" and "wrong password".
    if (!user || user.active === false) return unauthorized('Those details are not correct.');

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return unauthorized('Those details are not correct.');

    attempts.delete(clientKey);

    user.lastLoginAt = new Date();
    await user.save();

    const session = {
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role as AdminRole,
    };

    setSessionCookie(createSessionToken(session));

    return ok({ success: true, user: { email: session.email, name: session.name, role: session.role } });
  } catch (error) {
    return serverError('admin/auth/login', error);
  }
}
