# Day 1 - Priorizalt Backlog (P0/P1/P2)

Datum: 2026-03-30
Cel: napokra bontott roadmap issue-va alakitas

## P0 - Kritikus (azonnal inditando)

### P0-1 Analytics SDK alap integracio

- Prioritas: P0
- Leiras: Valasztott analytics SDK bekotese, app_start/session_start/screen_view eventekkel.
- Erintett: src/main.js, src/router/index.js, uj analytics service wrapper
- Elfogadasi kriterium:
  - app inditaskor es route valtaskor event megy
  - debug modban local logger latszik
  - build nem torik web + android targeten
- Becsles: 4-6 ora

### P0-2 Event tracking game loopra

- Prioritas: P0
- Leiras: match_start, match_end, tournament_end, continue_click bekotese.
- Erintett: src/views/GameView.vue, src/views/HomeView.vue, src/stores/game.js, src/stores/tournament.js
- Elfogadasi kriterium:
  - eventek egyszer mennek, nincs duplikacio
  - kotelezo parameterek kitoltve
  - QA checklist pass
- Becsles: 4-6 ora

### P0-3 Crash monitoring integracio

- Prioritas: P0
- Leiras: Sentry (vagy valasztott altern.) bekotes, global error capture.
- Erintett: src/main.js, global error handler
- Elfogadasi kriterium:
  - teszt hiba latszik a dashboardon
  - release sourcemap feltoltes folyamat dokumentalva
- Becsles: 3-4 ora

### P0-4 Privacy/compliance minimum

- Prioritas: P0
- Leiras: adatgyujtes disclosure + policy alapok.
- Elfogadasi kriterium:
  - dokumentalt event lista
  - kezelt consent strategia (ha szemelyes adatot erint)
- Becsles: 2-3 ora

## P1 - Erosen ajanlott

### P1-1 Daily challenge v1

- Prioritas: P1
- Leiras: deterministic napi challenge + claim flow.
- Becsles: 1.5-2 nap

### P1-2 Mission system v1

- Prioritas: P1
- Leiras: 3 kuldetes + progress engine + reset.
- Becsles: 1.5-2 nap

### P1-3 Onboarding tutorial

- Prioritas: P1
- Leiras: 20-30 sec interaktiv tutorial + skip opcio.
- Becsles: 1-1.5 nap

### P1-4 UX retention panel

- Prioritas: P1
- Leiras: match end motivacios panel + next action CTA tuning.
- Becsles: 0.5-1 nap

## P2 - Kovetkezo iteracio

### P2-1 Endless/survival mode

- Prioritas: P2
- Becsles: 1 nap

### P2-2 Shareable result card

- Prioritas: P2
- Becsles: 0.5-1 nap

### P2-3 Local leaderboard

- Prioritas: P2
- Becsles: 0.5-1 nap

### P2-4 Opponent personality content bovitese

- Prioritas: P2
- Becsles: 0.5 nap

## GitHub issue template (copy-paste)

Cim: [P0] Analytics SDK alap integracio

- Hattersztori:
- Scope:
- Nem scope:
- Elfogadasi kriteriumok:
- Meresi pontok:
- Risk:
- Becsles:
