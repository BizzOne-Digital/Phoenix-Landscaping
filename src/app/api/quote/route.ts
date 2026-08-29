import { NextResponse } from 'next/server';
import { site } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Quote request handler.
 *
 * EMAIL DELIVERY IS NOT ACTIVE UNTIL YOU SET THE ENVIRONMENT VARIABLES BELOW.
 *
 *   RESEND_API_KEY   API key from https://resend.com
 *   QUOTE_TO_EMAIL   Inbox that should receive leads (defaults to the site email)
 *   QUOTE_FROM_EMAIL A verified sender on your domain, e.g. quotes@yourdomain.ca
 *
 * Without them the submission is validated and written to the server log so
 * nothing silently disappears, but no email is sent. Set the variables (or
 * swap in your own mail provider / CRM call below) before launch.
 */

type QuotePayload = {
  name?: string;
  email?: string;
  phone?: string;
  propertyType?: string;
  service?: string;
  location?: string;
  message?: string;
  company?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max = 2000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let payload: QuotePayload;

  try {
    payload = (await request.json()) as QuotePayload;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: silently accept, never deliver.
  if (clean(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const lead = {
    name: clean(payload.name, 120),
    email: clean(payload.email, 160),
    phone: clean(payload.phone, 40),
    propertyType: clean(payload.propertyType, 60),
    service: clean(payload.service, 60),
    location: clean(payload.location, 200),
    message: clean(payload.message, 4000),
  };

  const missing = (['name', 'email', 'phone', 'propertyType', 'service', 'location'] as const).filter(
    (field) => !lead[field],
  );

  if (missing.length > 0 || !emailPattern.test(lead.email)) {
    return NextResponse.json(
      { ok: false, message: 'Please complete all required fields.' },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL ?? site.email;
  const from = process.env.QUOTE_FROM_EMAIL;

  if (!apiKey || !from) {
    // eslint-disable-next-line no-console
    console.warn(
      '[quote] Email delivery is not configured. Set RESEND_API_KEY and QUOTE_FROM_EMAIL. Lead received:',
      lead,
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const lines = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Property type: ${lead.propertyType}`,
    `Services needed: ${lead.service}`,
    `Property location: ${lead.location}`,
    '',
    'Message:',
    lead.message || '(none provided)',
  ];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject: `New quote request — ${lead.name} (${lead.propertyType})`,
        text: lines.join('\n'),
      }),
    });

    if (!response.ok) {
      throw new Error(`Mail provider responded with ${response.status}`);
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[quote] Failed to deliver lead:', error, lead);
    return NextResponse.json(
      { ok: false, message: 'We could not submit your request right now.' },
      { status: 502 },
    );
  }
}
