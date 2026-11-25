// Warung Rush — the menu: five dishes, each a fixed set of stations.
// A plate that matches a ticket's ingredient set exactly can go in the wok.
export const DISHES = [
  { id: 'nasi-goreng', name: 'Nasi Goreng', price: 25, cookMs: 2600, color: '#f2c14e', ingredients: ['nasi', 'telur', 'kecap', 'cabai'] },
  { id: 'mie-goreng',  name: 'Mie Goreng',  price: 22, cookMs: 2400, color: '#e07a5f', ingredients: ['mie', 'telur', 'sayur', 'kecap'] },
  { id: 'sate-ayam',   name: 'Sate Ayam',   price: 30, cookMs: 3200, color: '#d62828', ingredients: ['ayam', 'kecap', 'cabai'] },
  { id: 'gado-gado',   name: 'Gado-Gado',   price: 20, cookMs: 2000, color: '#81b29a', ingredients: ['sayur', 'telur', 'tahu', 'kecap'] },
  { id: 'es-teh',      name: 'Es Teh',      price: 10, cookMs: 1200, color: '#b08968', ingredients: ['teh', 'es'] },
];

export function dishById(id) {
  return DISHES.find((d) => d.id === id);
}

// Order-insensitive comparison of two ingredient lists.
export function sameSet(a, b) {
  if (a.length !== b.length) return false;
  return [...a].sort().join('|') === [...b].sort().join('|');
}
