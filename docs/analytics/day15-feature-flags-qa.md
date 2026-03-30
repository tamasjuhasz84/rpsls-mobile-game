# Day 15 - Feature Flag Prep + QA

Datum: 2026-03-30
Statusz: Completed

## Scope

- Day 15 roadmap cel: A/B-jellegu feature flag elokeszites, QA, regresszio.
- Erintett retention feluletek:
  - tutorial overlay
  - home daily challenge promo reszletek
  - match end motivational panel

## Bevezetett flag-ek

- `tutorialOverlay`: onboarding overlay ki/be kapcsolasa.
- `dailyChallengePromo`: home screen daily promo reszletek ki/be kapcsolasa.
- `matchEndMotivationPanel`: Day 14 motivacios meccsvegi panel ki/be kapcsolasa.

## Aktiv flag forrasok

1. Persistalt UI state

- Helye: `src/stores/ui.js`, `src/utils/storage.js`
- Cel: kesobbi experiment assignment vagy local rollout support.

2. Dev query-param override

- Csak dev modban aktiv.
- Togatott query paramok:
  - `ff_tutorial=on|off`
  - `ff_daily_promo=on|off`
  - `ff_match_panel=on|off`

Pelda:

- `/game?ff_match_panel=off`
- `/?ff_tutorial=off&ff_daily_promo=off`

## Validacio

1. Store smoke coverage

- Uj teszt: `src/stores/__tests__/ui.smoke.test.js`
- Ellenorzi:
  - default flag merge hydrate alatt
  - perzisztalt flag iras
  - runtime override precedence
  - unknown flag blokkolas

2. Regression run

- `npm test`: PASS
- `npm run build`: PASS

3. Analytics prep

- `app_start` event most kuld `feature_flags` summary mezot.
- Dev query override esetben `feature_flags_override_applied` event is megy.

## Megjegyzes

- Ez jelenleg local/dev flag infrastructure.
- Remote config vagy szerver oldali assignment nincs bevezetve ebben a korben.
