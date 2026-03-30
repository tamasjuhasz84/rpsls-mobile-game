# Day 3 - QA Checklist (Meresi validacio)

Datum: 2026-03-30
Statusz: Completed

## Scope

- Nap 3 roadmap cel: game loop eventek + tournament eventek + meresi QA validacio.
- Erintett eventek: match_start, match_end, tournament_end, continue_click.

## Ellenorzesek

1. Build ellenorzes

- Lepes: npm run build
- Eredmeny: PASS (vite build sikeres)

2. Tipushiba/szintaxis hiba ellenorzes

- Erintett fajlok:
  - src/views/GameView.vue
  - src/views/HomeView.vue
  - src/services/analytics/index.js
- Eredmeny: PASS (nincs reported hiba)

3. Event bekotes jelenlet ellenorzes (static grep)

- match_start: src/views/GameView.vue
- match_end: src/views/GameView.vue
- tournament_end: src/views/GameView.vue
- continue_click: src/views/HomeView.vue es src/views/GameView.vue
- app_start/session_start/screen_view: src/main.js es src/services/analytics/index.js
- Eredmeny: PASS

4. Dedup/guard validacio (kod review)

- match_start: trackedMatchStartKeys guard
- match_end: trackedMatchEndKeys guard
- tournament_end: trackedTournamentEndKeys guard
- Eredmeny: PASS

## Konkluzio

- Nap 3 implementacios es meresi QA cel teljesitve.
- Event funnel allapot: end-to-end tracking wiring kesz a roadmap Het 1 Day 3 scope szerint.

## Megjegyzes

- A runtime dashboard validaciohoz (Firebase DebugView / production stream) kulon smoke run javasolt Nap 5 smoke tesztekkel osszevonva.
