# ADR-0001: Quality Gates and CI Policy

Date: 2026-04-05
Status: accepted

## Context

The project targets portfolio-level credibility for medior frontend roles.
A key gap was missing repository-level quality enforcement that runs consistently on pull requests.

Without explicit quality gates:
- Regressions are easier to introduce.
- Candidate signal is weaker in technical review.
- Team-readiness is harder to demonstrate.

## Decision

Adopt repository-level quality gates with CI enforcement:

1. Local commands:
- `npm run lint`
- `npm run format:check`
- `npm test`
- `npm run test:coverage`
- `npm run test:e2e`

2. CI workflows:
- `quality.yml` runs lint, formatting check, unit/smoke tests, and coverage gate.
- `e2e.yml` runs Playwright critical user journeys.

3. Coverage threshold strategy:
- Enforce thresholds for critical logic layers first (`stores`, `utils`, `services`).
- Raise thresholds gradually as additional tests are added.

## Consequences

### Positive

- Prevents silent quality regression.
- Improves interview/recruiter confidence in engineering discipline.
- Creates a repeatable baseline for further tightening.

### Negative / Trade-offs

- CI runtime increases due to additional checks.
- Initial threshold scoping is pragmatic, not full-application strictness.

## Alternatives Considered

1. Keep only local checks without CI enforcement.
- Rejected: too easy to drift and not auditable in PRs.

2. Enforce full-app strict coverage immediately.
- Rejected: unstable baseline due to low-tested UI areas; blocked productive progress.

3. Run only E2E and skip unit-level gate.
- Rejected: slower feedback loop and weaker domain logic validation.

## Follow-up Actions

1. Increase coverage thresholds in planned increments.
2. Expand coverage scope to additional modules when test depth improves.
3. Track flaky tests and add reliability rules if needed.
