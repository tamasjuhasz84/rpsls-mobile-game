# Day 31 - Compliance Closeout Checklist

Datum: 2026-03-31
Statusz: In progress (manual Play Console + real device gate only)
Purpose: Day 4 roadmap blokk lezarasahoz hasznalhato publish-gate checklist

## 1. Repo alapjan lezart pontok

- [x] Terms of Use draft elerheto: [day21-terms-of-use-draft.md](day21-terms-of-use-draft.md)
- [x] Privacy policy draft frissitve a jelenlegi monitoring stackre
- [x] Data disclosure matrix frissitve a jelenlegi monitoring stackre
- [x] Player name telemetry audit lezart: analytics payloadba nem kerul be
- [x] Android crash monitoring status tisztazva: Sentry, nem Crashlytics

## 2. Manualis / kulso rendszerben vegrehajtando pontok

- [x] Privacy Policy publikus URL: https://rpsls-mobile-game.vercel.app/privacy
- [x] Terms publikus URL: https://rpsls-mobile-game.vercel.app/terms
- [ ] Play Console Data Safety kerdoiv kitoltese a disclosure matrix alapjan (answer sheet: day31-play-console-data-safety-answer-sheet.md)
- [ ] Policy warnings / content declarations ujraellenorzese Play Console-ban
- [x] Provider retention idok rogzitese a publikus policy szovegben (Firebase: 14 honap, Sentry: 90 nap)

## 3. Jogi / product dontest igenylo blokkolo pontok

- [x] Legal entity: Juhász Tamás (egyeni fejleszto, Budapest)
- [x] Privacy contact email: tamasjuhasz84@yahoo.com
- [x] Public contact email: tamasjuhasz84@yahoo.com
- [x] EEA/UK analytics consent dontes: MVP szakaszban nincs popup (elfogadott kockazat)
- [x] Governing law: Magyar jog
- [x] EEA -> harmadik orszag adattovabbitasi safeguard szoveg veglegesitese

## 4. Megmaradt tenyleges release blokkolok

- [ ] Play Console Data Safety submit + screenshot bizonyitek
- [ ] Play Console policy/content declarations vegso ellenorzes
- [ ] Minimum 2 real Android device QA matrix kitoltese (day25)

## 5. Publish gate minimum allapot

A nap 4 blokk akkor tekintheto lezartnak, ha:

- a Terms es Privacy policy publikus URL-en elerheto,
- a Data Safety valaszok egyeznek a matrix-szal,
- a placeholder jogi/contact mezok ki vannak toltve,
- es a consent dontes dokumentalva van.
