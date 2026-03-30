# Day 30 - Public Release Checklist

Datum: 2026-03-30
Statusz: Ready for manual execution
Constraint: Play Console muveletek ebbol a workspace-bol nem futtathatok.

## 1. Pre-launch gates

- [x] Signed AAB artifact available
- [x] Regression suite pass
- [x] Release note v1.0 draft prepared
- [x] Privacy/compliance docs available
- [x] Dashboard baseline and alert thresholds documented
- [x] Day 29 stability fixek integrated

## 2. Console execution gates

- [ ] Confirm final release track strategy (5% staged -> ramp)
- [ ] Upload/confirm final AAB on target track
- [ ] Paste final release notes
- [ ] Re-check policy warnings and content declarations
- [ ] Confirm rollout country and audience slices

## 3. Live observation gates

- [ ] T+2h check complete (startup, crash spike, blocker scan)
- [ ] T+24h check complete (funnel depth, daily flow adoption)
- [ ] T+72h check complete (D1 proxy + stability trend)
- [ ] Rollback trigger not hit

## 4. Rollback triggers (hard stop)

- Crash-free trend significantly below target direction
- Install/startup blockers on multiple devices
- Major drop match_start -> match_end with user-impacting errors
- Policy rejection that blocks distribution

## 5. Ramp plan (if healthy)

- Step 1: 5% staged rollout
- Step 2: 20% after healthy T+24h readout
- Step 3: 50% after healthy T+72h readout
- Step 4: 100% after no critical regression and acceptable funnel quality
