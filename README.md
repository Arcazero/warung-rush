# Warung Rush

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Arcazero/warung-rush/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Arcazero/warung-rush/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

**Warung Rush** — a fast Indonesian warung cooking game, built for make.fun's
["Make the best cooking game"](https://make.fun/bounty/best-cooking-game-20261125-0137)
bounty. You are the cook at a busy warung: orders land on the board, you pick
ingredients from the counter, cook them in the wok, and serve before the
customer's patience runs out.

## How to play

Open `game/index.html` in a desktop browser (keyboard + mouse, no network
needed). Click ingredient stations (or press `1–9`, `0`) to fill the plate.
When the plate matches a ticket exactly, click the wok to cook, then
**Sajikan** (or `Space`) to serve. Serve fast for time bonuses, chain serves
for combos, and watch out: every 5 served dishes the warung gets busier —
orders arrive faster and patience shrinks. Lose 3 orders and the warung
closes for the day.

The menu: Nasi Goreng, Mie Goreng, Sate Ayam, Gado-Gado, Es Teh — five dishes,
each with its own ingredient set and cook time. Es Teh is quick and cheap;
Sate Ayam pays the most but takes the longest in the wok.

## Files

- `game/index.html` — the shell (canvas + help bar)
- `game/src/config.js` — canvas size, layout, stations, palette
- `game/src/recipes.js` — the five dishes and their ingredient sets
- `game/src/kitchen.js` — game state and rules (orders, plate, wok, scoring)
- `game/src/input.js` — mouse + keyboard input
- `game/src/render.js` — all canvas drawing (original flat art, no images)
- `game/src/audio.js` — tiny synthesized sound effects (WebAudio, no files)
- `game/src/shots.js` — deterministic screenshot scenes (`?shot=…&seed=…`)
- `game/src/main.js` — entry point and game loop
- `main.ts` — the hand-in program: copies `game/` + `screenshots/` to the
  output directory and writes `dossier.json`

## Screenshots

Deterministic scenes, served locally and captured in a real browser:

- `1-start.png` — a fresh kitchen, two orders on the board
- `2-play.png` — a dish mid-assembly on the plate
- `3-serve.png` — a finished dish glowing on the wok, ready to serve
- `4-rush.png` — the dinner rush: four orders, one patience bar nearly empty

Reproduce any scene with `?shot=start|play|serve|rush&seed=1`, e.g.
`game/index.html?shot=serve&seed=1`.
