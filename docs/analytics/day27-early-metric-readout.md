# Day 27 - Early Metric Readout

Datum: 2026-03-30
Statusz: Prepared with current known state
Constraint: Valos soft launch dashboard adat ebben a workspace-ben nem erheto el.

## 1. What is known now

- Signed Android release AAB is available
- Automated regression passed: 182 / 182
- Analytics bootstrap exists for app_start, session_start, screen_view, match_start, match_end, tournament_end, continue_click
- Daily and share related tracking exists for daily_start, daily_complete, daily_claim, share_click, mission_claim
- Monitoring bootstrap exists, but Android native crash backend remains effectively pending from the earlier monitoring note

## 2. Readout status by Day 27 metric area

Crash:

- Live crash-free session data: PENDING
- Current confidence before rollout: medium
- Reason: release build passes, but no real-device rollout telemetry captured yet

Session quality:

- session_start instrumentation: READY
- screen funnel instrumentation: READY
- first real launch volume: PENDING

D1 proxy:

- Can be approximated after rollout from session return behavior
- Current status: PENDING, no launch cohort yet

Feature adoption:

- daily_start / daily_complete: READY to observe
- share_click: READY to observe
- mission_claim: READY to observe

## 3. First dashboard questions to answer once rollout begins

- Are Android session_start events arriving for version 0.1.0?
- Is home -> game -> match_start funnel healthy?
- Is there abnormal drop between match_start and match_end?
- Is daily_start visible, and does daily_complete occur at non-zero rate?
- Is share_click adoption non-zero after finished runs?

## 4. Immediate interpretation rules

- If session_start exists but match_start is very low, suspect onboarding/home CTA friction.
- If match_start is healthy but match_end is weak, suspect gameplay interruption, resume confusion, or stability issue.
- If daily_start is healthy but daily_complete is near zero, suspect challenge difficulty or reward clarity problem.
- If share_click is zero after completed runs, suspect the share CTA is not compelling or too low-priority.

## 5. Next data capture requirement

- Execute internal/soft launch rollout
- Read dashboard at T+2h, T+24h, T+72h
- Backfill this document with real counts and deltas
