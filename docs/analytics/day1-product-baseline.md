# Day 1 - Product Baseline (D1, D7, Session, Churn)

Datum: 2026-03-30
Projekt: rpsls-vue-project

## 1) KPI definiciok

### D1 retention

- Definicio: azon uj felhasznalok aranya, akik install/start napja utan 1 napon belul legalabb egy uj sessiont inditanak.
- Formula: D1 = returning_users_day_1 / new_users_day_0
- Cel (roadmap vege): >= 30%

### D7 retention

- Definicio: azon uj felhasznalok aranya, akik install/start napja utan 7 napon belul legalabb egy uj sessiont inditanak.
- Formula: D7 = returning_users_day_7 / new_users_day_0
- Cel (roadmap vege): >= 10%

### Session metrikak

- Session start: app foregroundba kerulese vagy app inditas.
- Session end: app background/close, vagy 30 perc inaktivitas timeout.
- Atlagos session hossz: sum(session_duration_sec) / sessions_count
- Cel: +20% az indulasi baseline-hoz kepest.

### Churn trigger (v1)

- Churn-risk user: aki az elmult 72 oraban nem inditott sessiont.
- Korai churn trigger: 3 egymast koveto vereseg utan app kilepes ugyanabban a sessionben.
- Funnel churn trigger: match_end utan nincs continue_click 10 masodpercen belul.

## 2) Baseline allapot (2026-03-30)

- Analytics integracio: meg nincs bekotve (Nap 2 feladat).
- Meresi baseline: T0 allapot, production historical adat nincs.
- Action: Nap 2 utan minimum 3-5 nap adatgyujtes, majd baseline freeze.

## 3) Instrumentacios scope Day 1 -> Day 3

- Day 1: KPI definiciok + event taxonomia.
- Day 2: app_start, session_start, screen_view bekotese.
- Day 3: game loop + tournament eventek e2e funnellel.

## 4) Kodbazis horgonyok (event mappinghez)

- Route-ok: src/router/index.js
- Home flow + continue CTA: src/views/HomeView.vue
- Match loop allapotgep: src/stores/game.js
- Tournament flow (advance/win/loss): src/views/GameView.vue es src/stores/tournament.js

## 5) Nyitott dontesek

- Session timeout ertek: 30 perc maradjon, vagy legyen 15 perc?
- Churn trigger kulcs-kuszobok: 72 ora inaktivitas + 3 vereseg megfelelo?
