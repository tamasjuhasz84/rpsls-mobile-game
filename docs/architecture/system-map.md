# Architecture System Map

Date: 2026-04-05
Scope: Web app architecture for RPSLS (Vue 3 + Pinia + Vite + Capacitor target)

## 1. High-Level Layers

1. UI layer
- Vue views and presentational components under `src/views` and `src/components`.
- Responsible for rendering, user interaction, and accessibility semantics.

2. State orchestration layer
- Pinia stores under `src/stores`.
- Owns application state, feature flow, and state transitions.

3. Domain utility layer
- Pure or mostly pure utility modules under `src/utils`.
- Owns reusable business logic (rules, AI helpers, persistence adapters, flags).

4. Integration layer
- Analytics and monitoring under `src/services`.
- Owns instrumentation, event dispatching, and runtime error capture.

5. App composition and routing layer
- Entry and bootstrapping in `src/main.js`.
- Route setup in `src/router/index.js`.

## 2. Runtime Flow (Primary Journey)

1. App boot
- `main.js` initializes Pinia, router, i18n, analytics, monitoring.
- UI and stats state hydrate from local storage.

2. Home to game transition
- `HomeView` chooses mode and starts/resumes flow.
- Tournament state is created or restored in store.

3. Round lifecycle
- `GameView` drives round loop, countdown, AI move, reveal, and result.
- `game` store tracks phase and round internals.
- `tournament` store tracks match/tournament progression.

4. Persistence and continuation
- `storage.js` stores and restores session/tournament/UI payloads.
- Resume path validates saved payload before hydration.

5. Observability
- `services/analytics` tracks key product and gameplay events.
- `services/monitoring` captures runtime failures.

## 3. Store Responsibilities

1. `game`
- Round phase state machine (`idle`, `countdown`, `locked`, `reveal`, `result`).

2. `tournament`
- Match and bracket progression, scores, mode-specific behavior.

3. `ui`
- Locale, toggles, feature flags, fatal-error state.

4. `stats`
- Aggregate player metrics and streaks.

5. `dailyChallenge`
- Daily challenge lifecycle and completion/claim state.

6. `mission`
- Mission progress and claim logic.

7. `leaderboard`
- Daily/all-time ranking and write policy.

8. `tutorial`
- Tutorial/onboarding state and completion lifecycle.

## 4. Dependency Direction Rules

Allowed direction (should be preserved):
- Views/components -> stores/composables/utils/services
- Stores -> utils/services
- Utils -> no store imports
- Services -> no store imports

Avoid:
- Cross-store tight coupling without explicit reason
- Utility modules importing UI/views
- Service modules mutating store directly

## 5. Quality Gates

Current repository-level gates:
- Lint: `npm run lint`
- Unit/smoke tests: `npm test`
- E2E tests: `npm run test:e2e`
- Coverage gate: `npm run test:coverage`
- Combined quality command: `npm run quality`

CI workflows:
- `.github/workflows/quality.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/release.yml`

## 6. Known Architecture Risks

1. Large view files
- `GameView.vue` and `HomeView.vue` are feature-rich and large.
- Risk: slower onboarding and higher refactor cost.

2. Large global stylesheet
- `main.css` centralization simplifies theming but increases merge pressure.

3. Mixed orchestrations
- Some orchestration remains in view-level scripts and can be extracted further.

## 7. Next Refactor Targets (Medior -> Senior Bridge)

1. Split `GameView` flow orchestration into domain composables.
2. Split `HomeView` secondary sections into dedicated feature components.
3. Introduce architecture lint/check for dependency boundaries.
4. Add architecture decision records for each major structural change.
