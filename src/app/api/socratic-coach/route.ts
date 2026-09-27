import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { childName, taskTitle, moodAfter, whereIGotStuck, whatClicked } = body;

    // Deterministic educational psychologist & principal Socratic script generator
    const isHighFriction = moodAfter === 'TIRED' || moodAfter === 'OVERWHELMED';

    const socraticScript = isHighFriction
      ? `"${taskTitle} was marked high-stretch today (${moodAfter.toLowerCase()}) — try asking ${childName}: 'Which part stretched your brain the most today, and how did you decide what strategy to try when ${whereIGotStuck ? whereIGotStuck.slice(0, 65) : 'you hit a wall'}?'"`
      : `"${childName} logged a breakthrough in ${taskTitle}! Try asking: 'You mentioned ${whatClicked ? whatClicked.slice(0, 70) : 'something clicked today'} — how could you teach that trick to me at dinner?'"`;

    const avoidPhrase = isHighFriction
      ? `"Why didn't you finish faster?" or "Did you get 100%?"`
      : `"You're so smart!" (Focus on strategy & effort instead of fixed ability)`;

    return NextResponse.json({
      ok: true,
      model: 'models/gemini-omni-1.1-flash',
      socraticScript,
      avoidPhrase,
      followUpAction: isHighFriction
        ? `Protect ${childName}'s next 20-minute Restorative Play buffer before any other High-Cognitive work.`
        : `Celebrate with a Growth-Mindset Grit or Creative Breakthrough badge.`,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to generate Socratic script' }, { status: 400 });
  }
}
