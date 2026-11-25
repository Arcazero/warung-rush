// Warung Rush — all canvas drawing: kitchen, order board, counter stations,
// plate, wok, HUD, and the menu / game-over overlays. Original flat art,
// drawn with paths and text only (no image files, no network requests).
import { W, H, BOARD, PLATE, WOK, SERVE, CLEAR, STATIONS, stationAt, PALETTE } from './config.js';
import { matchedOrder } from './kitchen.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function heart(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-9, -3, -5, -9, 0, -4);
  ctx.bezierCurveTo(5, -9, 9, -3, 0, 5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function stationColor(id) {
  const st = STATIONS.find((s) => s.id === id);
  return st ? st.color : '#cccccc';
}

function drawBackground(ctx) {
  ctx.fillStyle = PALETTE.wall;
  ctx.fillRect(0, 0, W, 470);
  ctx.strokeStyle = 'rgba(139,90,43,0.15)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 470; y += 46) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (let x = 0; x < W; x += 46) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 470); ctx.stroke(); }
  // Window with sky, sun and clouds.
  ctx.fillStyle = '#87ceeb';
  rr(ctx, 560, 30, 190, 110, 8); ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath(); ctx.arc(700, 70, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.ellipse(600, 60, 26, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(640, 80, 30, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = PALETTE.woodDark; ctx.lineWidth = 6;
  rr(ctx, 560, 30, 190, 110, 8); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(655, 30); ctx.lineTo(655, 140);
  ctx.moveTo(560, 85); ctx.lineTo(750, 85);
  ctx.stroke();
  // Wooden wall sign.
  ctx.fillStyle = PALETTE.wood;
  rr(ctx, 770, 30, 170, 54, 8); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WARUNG RUSH', 855, 64);
  // Floor and counter edge.
  ctx.fillStyle = PALETTE.floor;
  ctx.fillRect(0, 470, W, 130);
  ctx.fillStyle = PALETTE.counter;
  ctx.fillRect(0, 470, W, 14);
}

function drawBoard(ctx, state) {
  ctx.fillStyle = PALETTE.wood;
  rr(ctx, BOARD.x, BOARD.y, BOARD.w, BOARD.h, 10); ctx.fill();
  ctx.fillStyle = '#f3e2c0';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PAPAN PESANAN', BOARD.x + 12, BOARD.y + 22);
  state.orders.forEach((o, i) => {
    const x = BOARD.x + 8 + i * 105, y = BOARD.y + 32, w = 97, h = 104;
    ctx.fillStyle = '#fff8e7';
    rr(ctx, x, y, w, h, 8); ctx.fill();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(o.dish.name, x + w / 2, y + 18);
    o.dish.ingredients.forEach((ing, j) => {
      ctx.fillStyle = stationColor(ing);
      ctx.beginPath(); ctx.arc(x + 16 + j * 20, y + 38, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1; ctx.stroke();
    });
    const frac = Math.max(0, o.patience / o.maxPatience);
    ctx.fillStyle = '#dddddd';
    rr(ctx, x + 10, y + 58, w - 20, 10, 5); ctx.fill();
    ctx.fillStyle = frac > 0.5 ? PALETTE.green : frac > 0.25 ? '#e9c46a' : PALETTE.red;
    rr(ctx, x + 10, y + 58, (w - 20) * frac, 10, 5); ctx.fill();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(`${o.dish.price} koin`, x + w / 2, y + 90);
  });
  if (!state.orders.length) {
    ctx.fillStyle = '#f3e2c0';
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada pesanan…', BOARD.x + BOARD.w / 2, BOARD.y + 90);
  }
}

function drawStations(ctx) {
  STATIONS.forEach((st, i) => {
    const r = stationAt(i);
    ctx.fillStyle = '#fff8e7';
    rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = st.color;
    ctx.beginPath(); ctx.arc(r.x + r.w / 2, r.y + 34, 24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(st.name, r.x + r.w / 2, r.y + 72);
    ctx.fillStyle = '#888888';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(`[${st.key}]`, r.x + r.w / 2, r.y + 88);
  });
}

function drawPlate(ctx, state) {
  const matched = matchedOrder(state);
  ctx.save();
  if (matched) { ctx.shadowColor = PALETTE.green; ctx.shadowBlur = 24; }
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(PLATE.x, PLATE.y, PLATE.r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#d9c9a8'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(PLATE.x, PLATE.y, PLATE.r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(PLATE.x, PLATE.y, PLATE.r - 16, 0, Math.PI * 2); ctx.stroke();
  if (!state.plate.length) {
    ctx.fillStyle = '#b9b2a4';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PIRING', PLATE.x, PLATE.y + 5);
  }
  state.plate.forEach((ing, i) => {
    const a = (i / Math.max(1, state.plate.length)) * Math.PI * 2 - Math.PI / 2;
    const px = PLATE.x + Math.cos(a) * 52, py = PLATE.y + Math.sin(a) * 52;
    ctx.fillStyle = stationColor(ing);
    ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1.5; ctx.stroke();
  });
  if (matched && !state.cooking && !state.ready) {
    ctx.fillStyle = PALETTE.green;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ Cocok! Klik wajan untuk memasak', PLATE.x, PLATE.y - PLATE.r - 10);
  }
  ctx.fillStyle = '#e9e2d0';
  rr(ctx, CLEAR.x, CLEAR.y, CLEAR.w, CLEAR.h, 8); ctx.fill();
  ctx.fillStyle = PALETTE.ink;
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BUANG (C)', CLEAR.x + CLEAR.w / 2, CLEAR.y + 26);
}

function drawWok(ctx, state, now) {
  if (state.cooking) {
    const f = Math.sin(now / 90) * 6;
    ctx.fillStyle = '#f4a261';
    ctx.beginPath();
    ctx.moveTo(WOK.x - 52, WOK.y + 58);
    ctx.lineTo(WOK.x - 20, WOK.y + 96 + f);
    ctx.lineTo(WOK.x + 8, WOK.y + 58);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e76f51';
    ctx.beginPath();
    ctx.moveTo(WOK.x + 6, WOK.y + 58);
    ctx.lineTo(WOK.x + 34, WOK.y + 92 - f);
    ctx.lineTo(WOK.x + 58, WOK.y + 58);
    ctx.closePath(); ctx.fill();
  }
  ctx.save();
  if (state.ready) { ctx.shadowColor = PALETTE.gold; ctx.shadowBlur = 26; }
  ctx.fillStyle = '#2b2b2b';
  ctx.beginPath(); ctx.arc(WOK.x, WOK.y, WOK.r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#3d3d3d';
  ctx.beginPath(); ctx.arc(WOK.x, WOK.y, WOK.r - 12, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(WOK.x + WOK.r - 6, WOK.y + 30);
  ctx.lineTo(WOK.x + WOK.r + 44, WOK.y + 52);
  ctx.stroke();
  ctx.textAlign = 'center';
  if (state.cooking) {
    const frac = state.cooking.t / state.cooking.total;
    ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(WOK.x, WOK.y, WOK.r + 8, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('MEMASAK…', WOK.x, WOK.y + 4);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(state.cooking.dish.name, WOK.x, WOK.y + 22);
  } else if (state.ready) {
    ctx.fillStyle = PALETTE.gold;
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('SIAP!', WOK.x, WOK.y - 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(state.ready.name, WOK.x, WOK.y + 18);
  } else {
    ctx.fillStyle = '#bbbbbb';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('WAJAN', WOK.x, WOK.y + 4);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('klik saat piring cocok', WOK.x, WOK.y + 22);
  }
  ctx.fillStyle = state.ready ? PALETTE.green : '#b9b2a4';
  rr(ctx, SERVE.x, SERVE.y, SERVE.w, SERVE.h, 10); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.fillText('SAJIKAN', SERVE.x + SERVE.w / 2, SERVE.y + 31);
}

function drawHUD(ctx, state) {
  // Left column under the order board — the right side belongs to the wok.
  ctx.textAlign = 'left';
  ctx.fillStyle = PALETTE.ink;
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText(`Koin: ${state.coins}`, 20, 190);
  ctx.fillText(`Skor: ${state.score}`, 20, 216);
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(`Level ${state.level}  •  Tersaji: ${state.served}`, 20, 242);
  for (let i = 0; i < 3; i++) heart(ctx, 32 + i * 26, 262, 1.1, i < state.hearts ? PALETTE.red : '#cccccc');
  if (state.combo >= 2) {
    ctx.fillStyle = PALETTE.red;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(`KOMBO x${state.combo}!`, 20, 296);
  }
  if (state.flash) {
    ctx.globalAlpha = Math.max(0, 1 - state.flash.t / 1200);
    ctx.fillStyle = PALETTE.green;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.flash.text, PLATE.x, PLATE.y - PLATE.r - 34);
    ctx.globalAlpha = 1;
  }
}

function overlay(ctx, title, lines, hint) {
  ctx.fillStyle = 'rgba(43,29,18,0.72)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff8e7';
  rr(ctx, 180, 120, 600, 330, 16); ctx.fill();
  ctx.fillStyle = PALETTE.ink;
  ctx.textAlign = 'center';
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.fillText(title, W / 2, 190);
  ctx.font = '16px system-ui, sans-serif';
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 240 + i * 30));
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.fillStyle = PALETTE.green;
  ctx.fillText(hint, W / 2, 240 + lines.length * 30 + 30);
}

export function render(ctx, state, now) {
  drawBackground(ctx);
  drawBoard(ctx, state);
  drawStations(ctx);
  drawPlate(ctx, state);
  drawWok(ctx, state, now);
  drawHUD(ctx, state);
  if (state.screen === 'menu') {
    overlay(ctx, 'WARUNG RUSH', [
      'Masak pesanan secepat mungkin sebelum pelanggan kabur.',
      'Klik bahan di meja → klik wajan saat piring cocok → Sajikan.',
      'Tombol 1–9, 0 = bahan • Spasi = sajikan • C = buang piring.',
    ], 'Klik atau tekan Enter untuk mulai');
  }
  if (state.screen === 'over') {
    overlay(ctx, 'WARUNG TUTUP!', [
      `Kamu menyajikan ${state.served} pesanan dan mengumpulkan ${state.coins} koin.`,
      `Skor akhir: ${state.score}`,
    ], 'Klik untuk main lagi');
  }
}
