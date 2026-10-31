// Audio is optional and off until the reader turns it on.
// Effects are soft tones synthesised on the device with Web Audio: no files, no network, and they are NOT
// the Gulf Bank sonic logo. The official sonic logo is used only if an authorised file is supplied
// (see docs/media-pending.md). Narration plays only from recorded files listed in content; one at a time.

export type Effect = 'tap' | 'success' | 'place' | 'page' | 'gentle';

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

const NOTES: Record<Effect, [number, number][]> = {
  // [frequency Hz, start offset s]
  tap: [[660, 0]],
  place: [[523.25, 0], [659.25, 0.07]],
  success: [[523.25, 0], [659.25, 0.09], [783.99, 0.18]],
  page: [[440, 0]],
  gentle: [[392, 0], [349.23, 0.1]],
};

export function playEffect(effect: Effect, enabled: boolean) {
  if (!enabled || document.hidden) return;
  const ac = context();
  if (!ac) return;
  const now = ac.currentTime;
  for (const [freq, at] of NOTES[effect]) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + at);
    gain.gain.exponentialRampToValueAtTime(0.06, now + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.22);
    osc.connect(gain).connect(ac.destination);
    osc.start(now + at);
    osc.stop(now + at + 0.25);
  }
}

let current: HTMLAudioElement | null = null;

export function playNarration(src: string, onEnd: () => void) {
  stopNarration();
  const el = new Audio(src);
  current = el;
  el.addEventListener('ended', () => { if (current === el) { current = null; onEnd(); } });
  el.addEventListener('error', () => { if (current === el) { current = null; onEnd(); } });
  void el.play().catch(() => { if (current === el) { current = null; onEnd(); } });
}

export function stopNarration() {
  if (current) {
    current.pause();
    current.src = '';
    current = null;
  }
}

export function suspendAll() {
  stopNarration();
  try { void ctx?.suspend(); } catch { /* ignore */ }
}
