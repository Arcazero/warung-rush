// Warung Rush — tiny synthesized sound effects (WebAudio, no audio files).
// The context is created lazily on the first user gesture; every call is
// guarded so a browser without audio still plays fine.
let ctx = null;

export function ensureAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) { /* audio unavailable: play silently */ }
}

function tone(freq, dur = 0.08, type = 'sine', vol = 0.12, slide = 0) {
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch (e) { /* ignore */ }
}

export const sfx = {
  chop() { tone(520, 0.06, 'triangle', 0.10); },
  cook() { tone(180, 0.25, 'sawtooth', 0.05, 120); },
  ding() { tone(880, 0.12, 'sine', 0.12); setTimeout(() => tone(1320, 0.18, 'sine', 0.10), 90); },
  serve() { tone(660, 0.10, 'sine', 0.12); setTimeout(() => tone(990, 0.14, 'sine', 0.12), 80); },
  fail() { tone(220, 0.25, 'square', 0.08, -80); },
  click() { tone(440, 0.05, 'sine', 0.08); },
};
