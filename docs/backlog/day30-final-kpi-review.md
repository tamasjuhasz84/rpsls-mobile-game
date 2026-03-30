# Day 30 - Vegso KPI Review

Datum: 2026-03-30
Statusz: Completed with rollout-data constraints

## 1. KPI target scorecard

### Crash-free sessions (target: >= 99.5%)

- Current status: PENDING (live rollout dashboard adat nem erheto el ebben a workspace-ben)
- Technical readiness signal: MEDIUM-HIGH
- Evidence:
  - automated tests pass
  - production build pass
  - Day 29 stabilitasi fixek implementalva

### D1 retention (target: >= 30%)

- Current status: PENDING (cohort adatok hianyoznak)
- Readiness signal: MEDIUM
- Evidence:
  - daily + mission + onboarding + match-end hierarchy fixek aktivak
  - retention telemetry eventek bekotve

### D7 retention (target: >= 10%)

- Current status: PENDING (minimum 7 napos cohort window szukseges)
- Readiness signal: MEDIUM
- Evidence:
  - retention feature baseline kesz
  - v1 funnel dashboard strukturalt

### Atlag session hossz (target: +20%)

- Current status: PENDING
- Readiness signal: MEDIUM
- Evidence:
  - survival mode + continue flow + mission loop jelen van

### Store listing conversion (target: 5-10%)

- Current status: PENDING
- Readiness signal: MEDIUM
- Evidence:
  - store copy, screenshot pipeline, asset checklist dokumentalva

### Atlag rating (target: >= 4.3)

- Current status: PENDING
- Readiness signal: LOW-MEDIUM (publikus forgalomtol fugg)

## 2. KPI confidence summary

- Measured and confirmed now: build/test/process readiness
- Not yet measurable here: real rollout KPI values
- Recommended interpretation: KPI-goal trajectory is plausible, but not proven without T+2h/T+24h/T+72h dashboard readouts.

## 3. Day 30 recommendation

- Recommendation: CONDITIONAL GO for controlled public release sequence.
- Condition: first live dashboard readout must not trigger rollback criteria.
