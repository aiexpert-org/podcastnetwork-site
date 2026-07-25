import { NextRequest, NextResponse } from 'next/server';
import { submitQuizToGhl } from '@/lib/quiz/ghl';
import type { QuizResults } from '@/components/quiz/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SubmitPayload = {
  email?: unknown;
  firstName?: unknown;
  results?: unknown;
  variant?: unknown;
  site?: unknown;
};

function isValidEmail(value: string): boolean {
  if (typeof value !== 'string') return false;
  if (value.length < 5 || value.length > 254) return false;
  const at = value.indexOf('@');
  if (at < 1 || at === value.length - 1) return false;
  const dot = value.indexOf('.', at);
  if (dot < 0 || dot === value.length - 1) return false;
  return true;
}

export async function POST(request: NextRequest) {
  let body: SubmitPayload;
  try {
    body = (await request.json()) as SubmitPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const variant = body.variant === 'long' || body.variant === 'short' ? body.variant : null;
  const site =
    body.site === 'brettkmoore' || body.site === 'podcastnetwork' ? body.site : null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'email_invalid' }, { status: 400 });
  }
  if (!variant) {
    return NextResponse.json({ ok: false, error: 'variant_required' }, { status: 400 });
  }
  if (!site) {
    return NextResponse.json({ ok: false, error: 'site_required' }, { status: 400 });
  }
  if (!body.results || typeof body.results !== 'object') {
    return NextResponse.json({ ok: false, error: 'results_required' }, { status: 400 });
  }

  try {
    await submitQuizToGhl(
      email,
      firstName || undefined,
      body.results as QuizResults,
      variant,
      site
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[quiz/submit] GHL submission failed', err);
    return NextResponse.json({ ok: false, error: 'ghl_failed' }, { status: 502 });
  }
}
