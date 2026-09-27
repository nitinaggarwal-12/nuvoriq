'use client';

// Gentle Web Audio API synthesizer for non-jarring, neurodivergent-friendly Runway Alerts
export function playRunwayChime(type: 'RUNWAY_10MIN' | 'RUNWAY_3MIN' | 'TASK_COMPLETE' | 'KUDOS_SENT') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes: Record<typeof type, number[]> = {
      RUNWAY_10MIN: [523.25, 659.25, 783.99], // C5, E5, G5 warm marimba triad
      RUNWAY_3MIN: [587.33, 739.99, 880.0, 1174.66], // D5, F#5, A5, D6 gentle landing cue
      TASK_COMPLETE: [523.25, 659.25, 783.99, 1046.5], // C5 -> C6 celebration arpeggio
      KUDOS_SENT: [659.25, 830.61, 987.77], // E5, G#5, B5 warm chime
    };

    const seq = notes[type];
    seq.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.14 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.14);
      osc.stop(ctx.currentTime + idx * 0.14 + 0.7);
    });
  } catch {
    // Ignore audio context autoplay restrictions if un-interacted
  }
}
