# Day 37 - Medior Readiness Scorecard and Senior Gap Map

Date: 2026-04-05
Project: RPSLS Vue + Pinia mobile-first app
Goal: Validate medior readiness and define concrete gaps to senior-level frontend application quality.

## Executive Verdict

Medior frontend (Vue.js) target is defendable for this project.

Current placement:
- Strong Junior+ / Lower-Medior: yes
- Medior: yes (defendable with architecture + quality story)
- Senior: not yet

Reason in one line:
- Product is real and shipped-minded with good state/test/release hygiene, but lacks system-level depth expected for senior ownership.

## Evidence Snapshot (current)

- Lint: pass (`npm run lint`)
- Tests: 231/231 passing (`npm test`)
- CI quality workflow exists: `.github/workflows/quality.yml`
- Release automation exists: `.github/workflows/release.yml` + `.releaserc.json`
- Monitoring/analytics integrated in app startup and flows

## Medior Scorecard (100 points)

### 1) Product Delivery and Release Ownership (15)

Score: 13/15

What is strong:
- Real product flow, not tutorial-style app
- Android/Capacitor release scripts and checks
- Changelog + semantic-release pipeline in place

What is missing:
- Stricter release gates (approval/promotion strategy)

### 2) Frontend Architecture (20)

Score: 14/20

What is strong:
- Clear Vue + Pinia + router + i18n stack separation
- Domain stores and utility boundaries exist

What is missing:
- Some large view/style files reduce maintainability
- More explicit feature-boundary documentation is needed

### 3) Code Quality and Engineering Hygiene (15)

Score: 12/15

What is strong:
- ESLint + Prettier + quality command added
- CI checks lint/format/test on PR and push

What is missing:
- Lint policy still includes targeted relaxations; acceptable for now, but could be tightened gradually

### 4) Testing Strategy and Confidence (20)

Score: 14/20

What is strong:
- 231 passing tests
- Important game/store logic has strong smoke coverage

What is missing:
- Missing E2E coverage on top user journeys
- No published coverage threshold gate

### 5) Observability and Operational Maturity (10)

Score: 7/10

What is strong:
- Analytics provider abstraction
- Monitoring backend abstraction with Sentry fallback

What is missing:
- Explicit SLO/alert thresholds and dashboard definitions

### 6) UX, Accessibility, and Performance Discipline (10)

Score: 6/10

What is strong:
- Responsive, mobile-first implementation
- i18n integrated

What is missing:
- Formal a11y audit/checklist evidence
- Performance budget gate in CI

### 7) Documentation and Team Readiness (10)

Score: 7/10

What is strong:
- README and release docs are substantial

What is missing:
- ADR-style decision records
- Short architecture map for team onboarding

## Total

73/100

Interpretation:
- 65-75: Lower-Medior, defendable
- 75-85: Solid Medior
- 85+: Senior-like engineering signal

Current state is defendable medior with clear path to strong medior.

## Senior Gap Map (detailed)

### A) Architecture and Scalability

Missing for senior:
- Feature-sliced boundary contract and dependency rules
- Hard cap policy for oversized view/components with refactor playbook
- Dedicated application service layer for critical orchestration

### B) Test Depth and Risk Control

Missing for senior:
- E2E suite for 3-5 business-critical flows
- Coverage thresholds and PR block on threshold drop
- Flaky test triage workflow and labels

### C) CI/CD and Governance

Missing for senior:
- Branch protections with required checks + no-bypass rules
- Environment promotion model (dev/staging/prod)
- Rollback procedure tested and documented

### D) Reliability and Observability

Missing for senior:
- SLO targets (for example crash-free session rate)
- Alert definitions with response owner and runbook links
- Error taxonomy with severity classes

### E) Security and Compliance

Missing for senior:
- Dependency vulnerability policy with SLA
- Secrets/config governance checklist
- Security review checkpoint in release flow

### F) Accessibility and Performance

Missing for senior:
- Accessibility checklist integrated into Definition of Done
- Performance budgets and CI regression fail criteria
- Device/network profile benchmark matrix

### G) Leadership Signal (the real senior separator)

Missing for senior:
- ADR repository showing decision trade-offs
- Technical debt roadmap with measurable paydown outcomes
- Explicit KPI-driven product-engineering decisions

## 30-Day Action Plan (no Play package required)

All items below are repository/process improvements and do not require shipping a new Play Store binary.

### Week 1

- Done: Add architecture map doc (feature boundaries, data flow, store responsibilities)
- Done: Add ADR template and write first 2 ADRs
- Done: Add simple coverage reporting command and baseline report

### Week 2

- Done: Introduce Playwright for critical E2E flows
- Done: Add CI job for E2E smoke on pull requests
- Done: Add coverage threshold gate (initially realistic)

### Week 3

- Done: Add performance budget document and basic bundle size check
- Done: Add accessibility checklist and manual audit report (top 5 screens)
- Done: Add monitoring KPI dashboard spec (events -> KPI mapping)

### Week 4

- Add release governance document (promotion + rollback)
- Tighten selected ESLint rules from warn to error where safe
- Publish a concise case study summary for recruiters

## Recruiter/Interviewer Framing

Suggested framing:
- "The project is intentionally shipped-oriented and now has quality/release automation."
- "I can explain architecture trade-offs and show measurable quality gates."
- "Next phase is deepening E2E, performance, accessibility, and release governance to senior-grade maturity."

## Play Store Release Note

No new Play Store version is required for this scorecard roadmap itself.
A new Play package is needed only when runtime app changes are shipped to users.
