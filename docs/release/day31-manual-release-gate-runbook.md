# Day 31 - Manual Release Gate Runbook

Datum: 2026-03-31
Statusz: Ready
Purpose: A maradek kulso rendszeres blokkolok gyors, auditallhato lezarsa

## 1. Remaining blockers only

- Play Console Data Safety submit
- Play Console policy/content declarations final re-check
- Real device QA matrix completion (minimum 2 Android device)

## 2. Execution order

1. Play Console Data Safety

- Hasznald: day31-play-console-data-safety-answer-sheet.md
- Submit utan ments screenshot bizonyitekot
- Rogzitsd az idopontot a day31 checklistben

2. Policy/content declarations

- Ellenorizd: ads declaration, data safety consistency, target audience/content
- Ha warning van, javitas utan ujraellenorzes
- Ments screenshotot warning-free allapotrol

3. Real device QA

- Toltsd ki a day25-pre-release-qa-matrix.md tablazatot legalabb 2 valos keszulekre
- Kotelezo pass: install, launch, first match, daily vagy mission, survival, share (legalabb 1 tamogatott eszkoz)
- Rogzitsd a device model + Android verzio adatot

## 3. Definition of done

A gate akkor zarhato le, ha:

- [ ] Data Safety submitted and evidenced
- [ ] Policy warnings/content declarations clear
- [ ] Real device matrix has at least 2 PASS rows in relevant critical flows
- [ ] day31-compliance-closeout-checklist.md frissitve CLOSED allapotra

## 4. Quick rollback/hold rule

Ha barmelyik ponton P0 policy vagy crash issue jon elo:

- Ne induljon public rollout
- Maradjon internal/closed track
- Nyiss javitasi taskot es ujrafuttatas utan kapjon only-GO jelzest
