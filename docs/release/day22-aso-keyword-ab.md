# Day 22 - ASO Keyword A/B Plan (Manual)

Datum: 2026-03-30
Statusz: Draft v1
Method: Manual listing text iteration (no store-side native A/B assumed)

## 1. Objective

Novelni a listing conversion aranyt kulcsszo-fokuszu copy frissitessel, regresszio nelkul retention oldalon.

Primary KPI:

- Store listing conversion rate

Secondary KPI:

- Install -> first_open ratio
- D1 proxy (first day return signal)

## 2. Test setup (manual)

- Variant A baseline live 7-10 nap
- Variant B live 7-10 nap hasonlo traffic ablakkal
- Eredmeny osszehasonlitas azonos orszag + hasonlo hetnap mix mellett

## 3. Hungarian keyword direction

### HU Variant A (intent: classic rules + tournament)

Primary terms:

- ko papir ollo gyik spock
- rpsls
- torna jatek
- strategiai mini jatek

Secondary terms:

- napi kihivas
- survival mod
- leaderboard

Copy emphasis:

- bracket progression
- gyors korok
- napi challenge

### HU Variant B (intent: retention hooks + score chase)

Primary terms:

- survival jatek
- napi challenge jatek
- score chase
- mini strategy

Secondary terms:

- kuldetes
- streak
- toplista

Copy emphasis:

- daily loop
- mission loop
- local leaderboard + share

## 4. English keyword direction

### EN Variant A (intent: exact gameplay match)

Primary terms:

- rock paper scissors lizard spock
- rpsls
- tournament game
- strategy game

Secondary terms:

- daily challenge
- survival mode
- leaderboard

Copy emphasis:

- tactical rounds
- AI duel
- bracket progression

### EN Variant B (intent: session pattern + replay)

Primary terms:

- quick strategy game
- survival score game
- daily mission game
- competitive mini game

Secondary terms:

- score chase
- streak
- replayable

Copy emphasis:

- short session depth
- repeatable runs
- mission/reward loop

## 5. Decision rule

- Keep the variant that improves conversion >= +8% without visible first_open quality drop.
- If gain < +8%, keep clearer baseline (Variant A) and iterate only short description.

## 6. Logging checklist

- [ ] Baseline period dates logged
- [ ] Variant period dates logged
- [ ] Locale split logged (HU vs EN)
- [ ] Conversion and install quality comparison documented
