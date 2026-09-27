import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, summary } = body;

    return NextResponse.json({
      ok: true,
      provider: 'resend-webhook-stub',
      id: `re_${Math.random().toString(36).slice(2, 14)}`,
      status: 'delivered',
      to: to || 'parents@sharma-miller-family.org',
      subject: subject || 'Nuvoriq Sunday Family Summit Agenda',
      summary,
      dispatchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid Resend email payload' }, { status: 400 });
  }
}
