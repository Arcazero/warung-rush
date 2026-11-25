// Warung Rush — input: mouse clicks on stations, wok and buttons, plus
// keyboard shortcuts (1–9, 0 for ingredients, Space to serve, C to clear).
import { PLATE, WOK, SERVE, CLEAR, STATIONS, stationAt } from './config.js';
import { addIngredient, clearPlate, startCook, serveDish, startGame } from './kitchen.js';
import { ensureAudio, sfx } from './audio.js';

function inRect(x, y, r) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }
function inCircle(x, y, c) {
  const dx = x - c.x, dy = y - c.y;
  return dx * dx + dy * dy <= c.r * c.r;
}

export function bindInput(canvas, state, rng) {
  canvas.addEventListener('pointerdown', (ev) => {
    ensureAudio();
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) * (canvas.width / rect.width);
    const y = (ev.clientY - rect.top) * (canvas.height / rect.height);
    if (state.screen === 'menu' || state.screen === 'over') {
      sfx.click();
      startGame(state, rng);
      return;
    }
    for (let i = 0; i < STATIONS.length; i++) {
      if (inRect(x, y, stationAt(i))) { addIngredient(state, STATIONS[i].id); return; }
    }
    if (inCircle(x, y, WOK)) { startCook(state); return; }
    if (inRect(x, y, SERVE)) { serveDish(state); return; }
    if (inRect(x, y, CLEAR)) { clearPlate(state); return; }
  });

  window.addEventListener('keydown', (ev) => {
    if (state.screen === 'menu' || state.screen === 'over') {
      if (ev.key === 'Enter' || ev.key === ' ') { ensureAudio(); startGame(state, rng); }
      return;
    }
    const st = STATIONS.find((s) => s.key === ev.key);
    if (st) { ensureAudio(); addIngredient(state, st.id); return; }
    if (ev.key === ' ') { ev.preventDefault(); serveDish(state); }
    if (ev.key === 'c' || ev.key === 'C') clearPlate(state);
    if (ev.key === 'Enter') startCook(state);
  });
}
