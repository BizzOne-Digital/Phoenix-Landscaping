import { NextResponse } from 'next/server';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function badRequest(message = 'Invalid request.', errors?: Record<string, string>) {
  return NextResponse.json({ success: false, message, errors }, { status: 400 });
}

export function unauthorized(message = 'Authentication required.') {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = 'You do not have permission to do that.') {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFound(message = 'Not found.') {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function conflict(message = 'That value is already in use.') {
  return NextResponse.json({ success: false, message }, { status: 409 });
}

export function unprocessable(message: string, errors?: Record<string, string>) {
  return NextResponse.json({ success: false, message, errors }, { status: 422 });
}

/**
 * Logs the real error server-side and returns a generic message.
 * MongoDB details, stack traces and connection strings never reach the client.
 */
export function serverError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
  return NextResponse.json(
    { success: false, message: 'Something went wrong. Please try again.' },
    { status: 500 },
  );
}
