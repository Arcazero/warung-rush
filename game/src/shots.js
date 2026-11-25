// Warung Rush — deterministic screenshot scenes for ?shot=…&seed=….
// The judge compares screenshots, so each scene is a fixed, readable moment:
// start (fresh kitchen, two orders), play (a dish mid-assembly), serve (a
// finished dish glowing on the wok, ready to serve), rush (four orders,
// one patience bar nearly empty).
import { dishById } from './recipes.js';
import { newState } from './kitchen.js';

function ticket(dishId, patience, id) {
  return { dish: dishById(dishId), patience, maxPatience: 45, id };
}

export function applyShot(state, shot) {
  const fresh = newState();
  Object.assign(state, fresh, { screen: 'playing' });
  if (shot === 'start') {
    state.orders = [ticket('nasi-goreng', 42, 1), ticket('mie-goreng', 38, 2)];
  } else if (shot === 'play') {
    state.orders = [
      ticket('nasi-goreng', 30, 1),
      ticket('sate-ayam', 22, 2),
      ticket('gado-gado', 40, 3),
    ];
    state.plate = ['nasi', 'telur'];
    state.coins = 45; state.score = 450;
    state.combo = 1; state.comboTimer = 6;
  } else if (shot === 'serve') {
    state.orders = [ticket('mie-goreng', 28, 1), ticket('es-teh', 35, 2)];
    state.plate = ['mie', 'telur', 'sayur', 'kecap'];
    state.ready = dishById('mie-goreng');
    state.coins = 120; state.score = 1200;
    state.combo = 2; state.comboTimer = 8;
    state.level = 2; state.served = 6;
  } else { // rush
    state.orders = [
      ticket('nasi-goreng', 8, 1),
      ticket('mie-goreng', 25, 2),
      ticket('sate-ayam', 33, 3),
      ticket('gado-gado', 41, 4),
    ];
    state.plate = ['ayam', 'kecap'];
    state.coins = 210; state.score = 2100;
    state.combo = 3; state.comboTimer = 9;
    state.level = 3; state.served = 12;
  }
}
