# Day 26 - Soft Launch Targeting

Datum: 2026-03-30
Statusz: Draft v1
Goal: Korlatozott kezdeti forgalom alacsony kockazattal, ertelmezheto korai metricakkal.

## 1. Soft launch objective

- Validalni a release build stabilitasat valos telepitesi folyamatban
- Merheto korai session es retention proxy jeleket gyujteni
- Azonositani a legelso UX friction pontokat teljes release elott

## 2. Recommended market and audience

Primary locale strategy:

- EN-first soft launch for wider low-volume learning
- HU internal/community validation parhuzamosan kis mintan

Recommended soft launch countries:

- Ireland
- New Zealand
- Canada

Reasoning:

- Angol nyelvu piacok, de kisebb volumen, mint US/UK
- Konnyebben kezelheto korai support es review kockazat
- Elso funnel/minosegi jelekhez elegendo mintat adhatnak

## 3. Tester and audience slices

Slice A:

- Internal testers already familiar with the product
- Cel: install, launch, first match, share flow validacio

Slice B:

- Fresh players with no project context
- Cel: onboarding clarity, first-session completion, rage quit jelek

## 4. Rollout recommendation

- Internal testing: azonnal
- Closed or production staged rollout: 5% only after internal track basic PASS

## 5. Entry gate

- [x] Signed AAB available
- [x] Automated regression passed
- [ ] Minimum 2 real-device internal installs verified
- [ ] Upload key confirmed against Play Console expectation

## 6. Exit signal for moving beyond 5%

- No install blocker
- No launch blocker
- Crash-free sessions near target direction
- No obvious onboarding confusion from first tester feedback
