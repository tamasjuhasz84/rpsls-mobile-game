# Day 4 - Error Monitoring Integracio

Datum: 2026-03-30
Statusz: Completed

## Rogzitett strategia

- Web build: Firebase Analytics + Sentry
- Android wrapper build: Firebase Analytics + Crashlytics

## Implementalt elemek

- Monitoring service bootstrap:
  - src/services/monitoring/index.js
- Global error capture:
  - Vue error handler (app.config.errorHandler)
  - window error listener
  - unhandled promise rejection listener
- Userbarat fallback UI:
  - src/App.vue
  - src/stores/ui.js
  - src/i18n/locales/en.json
  - src/i18n/locales/hu.json
  - src/styles/main.css

## Runtime viselkedes

- Web + VITE_SENTRY_DSN beallitva: exception report megy Sentry-be.
- Web + DSN nelkul: console fallback.
- Android wrapper: backend jeloles crashlytics_pending (native crashlytics bridge kov. lepessel aktiv).

## Test crash/report szimulacio

- Dev modban elerheto helper:
  - window.**RPSLS_TEST_CRASH**()
- Elvart viselkedes:
  - error_captured analytics event generalodik
  - global fallback panel jelenik meg
  - Sentry DSN eseten report bekerul Sentry-be

## Nyitott Android task (Day 4.5)

- Capacitor Crashlytics plugin teljes native bekotese es release build validacio.
