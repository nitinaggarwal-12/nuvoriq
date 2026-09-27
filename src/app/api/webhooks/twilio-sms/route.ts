import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipient, message, childName } = body;

    return NextResponse.json({
      ok: true,
      provider: 'twilio-webhook-stub',
      sid: `SM${Math.random().toString(16).slice(2, 18)}`,
      status: 'delivered',
      recipient: recipient || '+1 (555) 234-8910',
      childName: childName || 'Child',
      bodyPreview: message,
      dispatchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid Twilio SMS payload' }, { status: 400 });
  }
}
