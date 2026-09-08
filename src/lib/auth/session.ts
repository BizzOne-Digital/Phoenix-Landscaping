import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db/mongoose';
import { AdminUser, type AdminRole } from '@/lib/db/models';

export const ADMIN_SESSION_COOKIE = 'phoenix_admin_session';

/** Seven days, in seconds. */
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
};

type SessionPayload = AdminSession & { exp: number };

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be set to a random string of at least 32 characters.',
    );
  }

  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64url(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function sign(payload: string): string {
  return base64url(createHmac('sha256', sessionSecret()).update(payload).digest());
}

/** Stateless HMAC-signed token. The secret never leaves the server. */
export function createSessionToken(session: AdminSession): string {
  const payload: SessionPayload = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return null;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromBase64url(body).toString('utf8')) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
    if (!payload.userId || !payload.email) return null;

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name ?? '',
      role: payload.role ?? 'editor',
    };
  } catch {
    return null;
  }
}

/** Reads the session from the request cookie. Returns null when absent/invalid. */
export function getAdminSession(): AdminSession | null {
  return verifySessionToken(cookies().get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Confirms the signed session still maps to an active account.
 * Used by the admin layout so a deactivated or deleted admin loses access
 * immediately instead of at token expiry.
 */
export async function getVerifiedAdminSession(): Promise<AdminSession | null> {
  const session = getAdminSession();
  if (!session) return null;

  try {
    await connectToDatabase();
    const user = await AdminUser.findById(session.userId).select('active role email name').lean();
    if (!user || user.active === false) return null;

    return {
      userId: session.userId,
      email: user.email,
      name: user.name,
      role: user.role as AdminRole,
    };
  } catch (error) {
    console.error('[auth] Could not verify admin session:', error);
    return null;
  }
}

export function setSessionCookie(token: string): void {
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(): void {
  cookies().set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
