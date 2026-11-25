// Warung Rush — shared constants: canvas size, layout and palette.
// Every module reads geometry from here, so hit-testing and drawing agree.
export const W = 960;
export const H = 600;

export const BOARD = { x: 16, y: 14, w: 430, h: 148 };
export const PLATE = { x: 470, y: 300, r: 104 };
export const WOK = { x: 770, y: 300, r: 78 };
export const SERVE = { x: 700, y: 420, w: 150, h: 48 };
export const CLEAR = { x: 395, y: 424, w: 150, h: 40 };
export const STATION_ROW = { x: 13, y: 486, w: 88, h: 96, gap: 6 };

export const STATIONS = [
  { id: 'nasi',  name: 'Nasi',  key: '1', color: '#f5f0dc' },
  { id: 'mie',   name: 'Mie',   key: '2', color: '#f2c14e' },
  { id: 'telur', name: 'Telur', key: '3', color: '#fff3b0' },
  { id: 'ayam',  name: 'Ayam',  key: '4', color: '#e07a5f' },
  { id: 'sayur', name: 'Sayur', key: '5', color: '#81b29a' },
  { id: 'tahu',  name: 'Tahu',  key: '6', color: '#f4f1de' },
  { id: 'kecap', name: 'Kecap', key: '7', color: '#6d4c41' },
  { id: 'cabai', name: 'Cabai', key: '8', color: '#d62828' },
  { id: 'teh',   name: 'Teh',   key: '9', color: '#b08968' },
  { id: 'es',    name: 'Es',    key: '0', color: '#a8dadc' },
];

export const MAX_ORDERS = 4;
export const MAX_PLATE = 6;

export const PALETTE = {
  wall: '#f7e8c8', wallDark: '#eed9ae', wood: '#8b5a2b', woodDark: '#6f4520',
  counter: '#c98f4e', floor: '#a9713f', ink: '#3b2a1a',
  green: '#2a9d8f', red: '#e63946', gold: '#ffd166',
};

export function stationAt(i) {
  const r = STATION_ROW;
  return { x: r.x + i * (r.w + r.gap), y: r.y, w: r.w, h: r.h };
}
