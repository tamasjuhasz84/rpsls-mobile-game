# Day 20 - Heti Review es UX/A11y Sweep

Datum: 2026-03-30
Statusz: Completed

## Het 4 osszefoglalo

- Day 16: opponent archetype szemelyiseg + strategy flavor + intro copy.
- Day 17: survival mode alap, endless ellenfel-lanc, run score formula.
- Day 18: shareable result card + share/copy flow + share_click tracking.
- Day 19: local leaderboard daily/all-time, storage migration, Home UI panel.
- Day 20: UX polish (spacing/readability/motion tuning) + accessibility sweep.

## Day 20 konkret output

- Jobb kontraszt es olvashatosag: soft text, label opacity, status hint readability javitva.
- Ersebb focus-visible jelzes billentyuzetes navigaciohoz.
- Mozgas-erzekeny felhasznalokhoz reduced-motion kiterjesztve (streak highlight is).
- Move selector szemantika javitva (ul/li) es status aria-live.
- Home mode selector aria group + pressed allapot.
- Leaderboard elemek screen-reader szoveggel ellatva.

## Fobb kockazatok

1. Leaderboard pontformula tovabbra is heurisztikus.

- Jelenleg egyszeru, jol skálazodo local formula fut.
- Kovetkezo lepes: valos session adatok alapjan tuning (survival vs bo3/bo5 parity).

2. Accessibility ellenorzes manualis, nem automatizalt.

- A sweep most kodszintu javitasokra epit.
- Kovetkezo lepes: komponens smoke + axe alapu audit script (ha tooling bekerul).

3. Home screen informacio-suruseg magasabb lett.

- Daily + mission + stats + leaderboard egy lapon jelenik meg.
- Kovetkezo lepes: user telemetry alapjan collapse/expand vagy tabos bontas fontolasa.

## Go-forward

- Het 4 celjai roadmap szerint teljesultnek tekinthetoek.
- Kovetkezo logikus blokk: Het 5 Day 21 (privacy policy draft + data disclosure matrix + legal TODO).
