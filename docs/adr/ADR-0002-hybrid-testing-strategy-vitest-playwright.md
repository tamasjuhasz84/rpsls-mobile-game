# ADR-0002: Hybrid Testing Strategy (Vitest + Playwright)

Date: 2026-04-05
Status: accepted

## Context

The application includes:
- Stateful game/tournament domain logic.
- Multi-step UI flows (start/resume/advance).
- Runtime behavior influenced by persistence and feature flags.

A single testing style was insufficient:
- Unit-only misses browser interaction and route flow issues.
- E2E-only is slower and weaker at fine-grained domain regression detection.

## Decision

Use a hybrid strategy:

1. Vitest (`src/**/*.smoke.test.js`) for fast domain and store confidence.
2. Playwright (`tests/e2e`) for critical user journey confidence.

Current E2E critical set:
- Home start navigation to game.
- Mode switch state behavior.
- Continue from saved tournament.
- Round lifecycle reaches result state.
- Match-end advance continues to next opponent.

## Consequences

### Positive

- Fast feedback for core logic via Vitest.
- High-confidence flow verification in real browser via Playwright.
- Better balance of speed and realism for portfolio-grade quality.

### Negative / Trade-offs

- More setup and maintenance than a single-framework approach.
- Browser dependencies increase CI complexity.
- Some UI overlays (tutorial) require deterministic setup in tests.

## Alternatives Considered

1. Vitest-only.
- Rejected: weak confidence for route/UI integration and real interaction issues.

2. Playwright-only.
- Rejected: slower iterations and weaker fine-grained domain feedback.

3. Cypress instead of Playwright.
- Not selected for now: Playwright chosen for straightforward multi-project (desktop/mobile) setup.

## Follow-up Actions

1. Add 2-3 additional E2E flows for loss/restart and daily challenge edges.
2. Introduce data-test selectors for long-term selector stability.
3. Track E2E runtime and split smoke vs extended suites if needed.
