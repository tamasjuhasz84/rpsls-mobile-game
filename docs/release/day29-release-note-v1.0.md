# Release Note - v1.0 (Day 29 Draft, Day 16 Update)

Datum: 2026-03-31
Statusz: Updated for release closeout v1
Build scope: Soft launch RC stabilization pass + Week 3 quality hardening

## Summary

Ez a v1.0 release note a 6 hetes MVP+ roadmap fo eredmenyeit foglalja ossze, Day 29 stabilizacios frissitessel.

## Highlights

- Daily Challenge rendszer deterministic seed + napi allapot kovetes + reward claim flow.
- Mission system v1 (3 alap kuldetes) progress engine-nel.
- Interaktiv tutorial flow skip opcioval es tutorial event trackinggel.
- Survival mode + local leaderboard + share result flow.
- Android release pipeline (AAB), internal test track dokumentalt folyamattal.
- Error monitoring + analytics funnel baseline a launch-heti readoutokhoz.

## Day 29 technical stability updates

- Round-result duplikacio elleni vedelem store-szintre emelve a game loopban.
- Korrupt/hibas game-state payload vedelme erosodott (`loadGameState` shape validation).
- Dashboard baseline cleanup: panel sorrend, segment alapbeallitasok, alert jelzesek tisztitva.

## User-facing improvements from recent cycle

- Home first-session fokusz tisztabb primary start path-tal.
- Continue/resume helper copy pontositva.
- Match-end action hierarchy egyszerusitve (primary vs secondary action).

## Day 16 addendum (Week 3 consolidation)

- Day 11: retention copy tuning + continue-flow minifriction csokkentes + event payload validacio.
- Day 12: survival pacing finomhangolas + score/readability javitas.
- Day 13: opponent personality polish + HU/EN copy minosegi atnezes.
- Day 14: edge-case tesztcsomag bovites (game loop + persistence), flaky trigger vedelmek megerositese.
- Day 15: heti trend review + release-prep gyorsjavitasok.

## Verification snapshot

- Regression suite: PASS (231/231)
- Build verification: PASS (`npm run build`)

## Known limitations (v1.0)

- Android crash backend jelenleg Sentry-fokuszu, Crashlytics bridge nincs aktivra kotve.
- Dashboard retention olvasat soft launch volumenfuggo, D1/D7 kovetkeztetes korai fazisban zajos lehet.

## Monitoring focus after rollout

- Crash-free sessions trend (cel: 99.5%+ irany)
- home -> game -> match_start -> match_end -> tournament_end funnel
- continue_click, daily_start/daily_complete, share_click hasznalat

## Rollback trigger reminder

- Crash-free trend erdemi romlasa
- Startup/session_start anomalia release builden
- match_start magas, match_end alacsony tartos mintazat

## Suggested changelog snippet

### Added

- Daily challenge + mission + tutorial + survival + local leaderboard + share flow.

### Changed

- Home and match-end CTA hierarchy retention-fokuszu egyszerusitese.

### Fixed

- Duplicate round-result processing edge-case vedelem.
- Invalid persisted game-state payload recovery hardening.
