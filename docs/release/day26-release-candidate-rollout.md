# Day 26 - Release Candidate Build and 5% Rollout

Datum: 2026-03-30
Statusz: Prepared for manual execution
Constraint: Play Console rollout cannot be executed from this workspace without account access.

## 1. Release candidate artifact

- Artifact: android/app/build/outputs/bundle/release/app-release.aab
- Version name: 0.1.0
- Version code: 1
- Signing status: signed

## 2. Manual rollout sequence

1. Complete Day 25 internal upload and install validation.
2. Confirm no signing mismatch in Play Console.
3. Open the release track intended for limited rollout.
4. Create the release from the validated signed AAB.
5. Paste the final release note.
6. Review policy, device coverage, and app content warnings.
7. Start with 5% staged rollout.
8. Record rollout start timestamp.
9. Freeze non-critical changes during first observation window.

## 3. Observation window

Recommended first review windows:

- T+2h: install blockers, crash spikes, startup issues
- T+24h: session depth, first-match completion, daily challenge usage
- T+72h: D1 proxy and early funnel quality

## 4. Rollback triggers

- Crash spike materially above target direction
- Install or launch blocker on multiple devices
- Share or match flow causing hard-stop errors
- Severe policy or content rejection signal

## 5. RC handoff data to capture

- rollout timestamp
- version name
- version code
- countries included
- audience slice used
- top warnings from Play Console
