// Warung Rush — entry point: wire the canvas, the input and the loop.
// With ?shot=start|play|serve|rush&seed=N the scene is frozen on that exact
// moment (no timers advance), so screenshots are reproducible.
import { newState, update, mulberry32 } from './kitchen.js';
import { bindInput } from './input.js';
import { render } from './render.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(location.search);
const seed = parseInt(params.get('seed') || '1', 10);
const rng = mulberry32(seed);
const state = newState();
const shot = params.get('shot');
if (shot) {
  // Screenshot mode: hide the page help bar so the canvas fills the frame.
  const help = document.getElementById('help');
  if (help) help.style.display = 'none';
  applyShot(state, shot, seed);
}
bindInput(canvas, state, rng);
window.__warung = { state };

let last = performance.now();
function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  if (!shot) update(state, dt, rng);
  render(ctx, state, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
