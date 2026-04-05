# Day 39 - Release Governance and Rollback Policy

Date: 2026-04-05
Status: active
Scope: Repository and release-process governance for web + Android delivery readiness

## 1. Release Promotion Model

Release stages:

1. Development
- Local feature implementation and test iteration.
- Required local checks before PR: `npm run quality`, `npm run test:e2e`, `npm run perf:ci`.

2. Pull Request validation
- CI gates must pass:
  - lint + format + unit/smoke + coverage (`quality.yml`)
  - E2E smoke (`e2e.yml`)

3. Main branch integration
- Rebase and merge only after green checks.
- No bypass for failed quality gates.

4. Release preparation
- Confirm release notes/changelog readiness.
- Validate Android release secrets availability.
- Confirm version alignment (`package.json` vs Android `versionName`) and increment `versionCode`.

5. Store submission
- Build and verify AAB (`android:aab:release`).
- Submit to internal/closed track first when applicable.

## 2. Mandatory Release Checklist

Before creating/submitting release artifacts:

1. `npm run quality` passes.
2. `npm run test:e2e` passes.
3. `npm run perf:ci` passes.
4. No unresolved critical bug in release scope.
5. Changelog and release note updated.
6. Monitoring and dashboard queries reviewed for new release window.

## 3. Incident Severity Levels

1. Sev-1
- App unusable, crash loops, data-loss risk.
- Immediate rollback/hotfix path.

2. Sev-2
- Major feature unavailable for meaningful user segment.
- Rapid patch release targeted.

3. Sev-3
- Non-critical defect with workaround.
- Scheduled fix in next regular release.

## 4. Rollback Strategy

### A) Repository rollback

Use when bad change is merged but release artifact not yet submitted.

1. Revert offending commit(s) with explicit revert commit.
2. Re-run full quality gates.
3. Merge and release corrected state.

### B) Store-track rollback

Use when release artifact is already published to testers/users.

1. Pause promotion to wider track.
2. Promote last known good artifact if available.
3. If no safe rollback artifact exists, publish hotfix build with incremented `versionCode`.
4. Record incident timeline and root cause.

## 5. Hotfix Flow

1. Branch from latest main.
2. Apply minimal fix only.
3. Run full mandatory checks.
4. Ship hotfix with explicit release note label (hotfix).
5. Post-incident review within 24-48h.

## 6. Branch and Merge Policy

1. Keep main releasable.
2. Prefer small PRs with isolated scope.
3. Require descriptive PR summary: risk, tests, rollback notes.
4. No direct push for unreviewed high-risk changes.

## 7. Ownership and Cadence

1. Daily release-health check during active launch windows.
2. Weekly governance review:
- Gate reliability
- Flaky test analysis
- Rollback readiness

## 8. Evidence Artifacts

Maintain these artifacts per release cycle:

1. Quality run outputs (`quality`, `test:e2e`, `perf:ci`).
2. Changelog and release notes.
3. KPI snapshot (2h/24h/72h post-release).
4. Incident notes if rollback/hotfix happened.
