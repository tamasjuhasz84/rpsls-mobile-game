# Day 4 - Error Monitoring Integracio

Datum: 2026-03-30
Statusz: Completed

## Rogzitett strategia

- Web build: Firebase Analytics + Sentry
- Android wrapper build: Firebase Analytics + Sentry

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
- Android wrapper + VITE_SENTRY_DSN beallitva: exception report megy Sentry-be.
- Android wrapper DSN nelkul: console fallback.

## Test crash/report szimulacio

- Dev modban elerheto helper:
  - window.**RPSLS_TEST_CRASH**()
- Elvart viselkedes:
  - error_captured analytics event generalodik
  - global fallback panel jelenik meg
  - Sentry DSN eseten report bekerul Sentry-be

## Android crash backend (V2 Day 1 - Lezarva)

Dontés: Natív Crashlytics bridge helyett Sentry @sentry/vue kiterjesztve Android platformra.
A Sentry JS SDK Capacitor WebView kornyezetben teljes erteku exception trackinget vegez.
A `crashlytics_pending` backend allapot megszunt — lathato: src/services/monitoring/index.js.
Reszletes strategia: docs/analytics/monitoring-runbook.md
