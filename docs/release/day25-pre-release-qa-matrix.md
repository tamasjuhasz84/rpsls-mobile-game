# Day 25 - Pre-Release QA Matrix

Datum: 2026-03-30
Statusz: Draft v1
Target: Internal test readiness

## 1. Build under test

- Artifact: android/app/build/outputs/bundle/release/app-release.aab
- Version name: 0.1.0
- Version code: 1
- Build type: release, signed AAB

## 2. Regression baseline

- Web regression: PASS
- Android release bundle build: PASS
- Signed artifact present: PASS

## 3. Device and OS matrix

Status meanings:

- PASS = verified on device
- PENDING = not yet verified on device
- BLOCKED = verification blocked by environment or account issue

| Device class   | Example device | Android version | Install | Launch  | First match | Daily/mission | Survival | Share   | Notes              | Status  |
| -------------- | -------------- | --------------- | ------- | ------- | ----------- | ------------- | -------- | ------- | ------------------ | ------- |
| Small phone    | Pending        | 13              | PENDING | PENDING | PENDING     | PENDING       | PENDING  | PENDING | Real device needed | PENDING |
| Mainline phone | Pending        | 14              | PENDING | PENDING | PENDING     | PENDING       | PENDING  | PENDING | Real device needed | PENDING |
| Large phone    | Pending        | 15              | PENDING | PENDING | PENDING     | PENDING       | PENDING  | PENDING | Real device needed | PENDING |
| Tablet         | Pending        | 14              | PENDING | PENDING | PENDING     | PENDING       | PENDING  | PENDING | Real device needed | PENDING |

## 4. Critical flows to verify

- App install from internal track
- First launch and home screen render
- Start new tournament
- Resume saved run
- Daily challenge start and completion feedback
- Mission progress update
- Survival mode entry and score update
- Leaderboard read/write after a finished run
- Share result flow on supported device

## 5. Exit gate

- [ ] Minimum 2 real devices validated
- [ ] No P0 crash on install/launch/first match
- [ ] At least one daily and one survival flow verified
- [ ] Share flow checked on at least one supported device
