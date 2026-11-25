// Warung Rush — game state and rules: orders, the plate, the wok, scoring.
// Pure logic: no canvas calls here, so the rules can be read (and tested) alone.
import { DISHES, sameSet } from './recipes.js';
import { MAX_ORDERS, MAX_PLATE } from './config.js';
import { sfx } from './audio.js';

// Deterministic RNG so screenshot scenes can be reproduced from a seed.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newState() {
  return {
    screen: 'menu', time: 0, coins: 0, score: 0, combo: 0, comboTimer: 0,
    hearts: 3, level: 1, served: 0, spawnTimer: 1200,
    orders: [], plate: [], cooking: null, ready: null, flash: null,
  };
}

function patienceFor(level) { return Math.max(25, 45 - (level - 1) * 2); }
function spawnIntervalFor(level) { return Math.max(5000, 11000 - (level - 1) * 900); }

export function spawnOrder(state, rng) {
  if (state.orders.length >= MAX_ORDERS) return;
  const dish = DISHES[Math.floor(rng() * DISHES.length)];
  const patience = patienceFor(state.level);
  state.orders.push({ dish, patience, maxPatience: patience, id: state.time + Math.random() });
}

// The waiting order whose recipe matches the plate exactly, if any.
export function matchedOrder(state) {
  if (!state.plate.length) return null;
  return state.orders.find((o) => sameSet(state.plate, o.dish.ingredients)) || null;
}

export function addIngredient(state, id) {
  if (state.screen !== 'playing' || state.cooking || state.ready) return;
  if (state.plate.length >= MAX_PLATE) return;
  state.plate.push(id);
  sfx.chop();
}

export function clearPlate(state) {
  if (state.screen !== 'playing' || state.cooking) return;
  state.plate = [];
  sfx.click();
}

export function startCook(state) {
  if (state.screen !== 'playing' || state.cooking || state.ready) return;
  const order = matchedOrder(state);
  if (!order) return;
  state.cooking = { dish: order.dish, t: 0, total: order.dish.cookMs };
  sfx.cook();
}

export function serveDish(state) {
  if (state.screen !== 'playing' || !state.ready) return;
  const order = state.orders.find((o) => o.dish.id === state.ready.id);
  if (!order) { state.ready = null; return; }
  const timeBonus = Math.round((order.patience / order.maxPatience) * 10);
  const comboBonus = state.combo * 2;
  const earned = order.dish.price + timeBonus + comboBonus;
  state.coins += earned;
  state.score += earned * 10;
  state.combo += 1;
  state.comboTimer = 10;
  state.served += 1;
  state.level = 1 + Math.floor(state.served / 5);
  state.orders = state.orders.filter((o) => o !== order);
  state.plate = [];
  state.ready = null;
  state.flash = { text: `+${earned} koin`, t: 0 };
  sfx.serve();
}

export function update(state, dt, rng) {
  if (state.screen !== 'playing') return;
  state.time += dt;
  if (state.comboTimer > 0) {
    state.comboTimer -= dt / 1000;
    if (state.comboTimer <= 0) state.combo = 0;
  }
  if (state.flash) {
    state.flash.t += dt;
    if (state.flash.t > 1200) state.flash = null;
  }
  if (state.cooking) {
    state.cooking.t += dt;
    if (state.cooking.t >= state.cooking.total) {
      state.ready = state.cooking.dish;
      state.cooking = null;
      sfx.ding();
    }
  }
  for (const o of [...state.orders]) {
    o.patience -= dt / 1000;
    if (o.patience <= 0) {
      state.orders = state.orders.filter((x) => x !== o);
      state.hearts -= 1;
      state.combo = 0;
      sfx.fail();
      if (state.hearts <= 0) state.screen = 'over';
    }
  }
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnOrder(state, rng);
    state.spawnTimer = spawnIntervalFor(state.level);
  }
}

export function startGame(state, rng) {
  const fresh = newState();
  Object.assign(state, fresh, { screen: 'playing' });
  spawnOrder(state, rng);
  spawnOrder(state, rng);
  state.spawnTimer = spawnIntervalFor(1);
}
