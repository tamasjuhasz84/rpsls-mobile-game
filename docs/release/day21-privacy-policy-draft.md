# Day 21 - Privacy Policy Draft (HU/EN launch prep)

Datum: 2026-03-31
Statusz: Draft v3
Scope: RPSLS mobile web + Android wrapper (Capacitor)

## 1. Ki az adatkezelo

- Product/App nev: RPSLS Tournament
- Adatkezelo jogi neve: Juhász Tamás (egyeni fejleszto)
- Kapcsolati email: tamasjuhasz84@yahoo.com
- Székhely/cim: Budapest, Magyarország

## 2. Milyen adatokat kezel az app

A jelenlegi implementacio alapjan az app account nelkul fut, es foleg alkalmazas-telemetria + helyi mentes tortenik.

### 2.1 Helyben (keszuleken) tarolt adatok

- Tournament allapot (folytathato run adatok)
- UI beallitasok (nyelv, hang, haptics)
- Statisztikak (wins/losses/draw, streak)
- Daily challenge es mission allapot
- Leaderboard local allapot (daily/all-time)

Technikai reszlet: localStorage kulcsok a [src/utils/storage.js](../../src/utils/storage.js)-ben.

### 2.2 Telemetria / monitoring adatok

- Analytics eventek (pl. screen_view, match_start, match_end, tournament_end, continue_click, daily\_\*, mission_claim, share_click)
- Event metadata (pl. mode, score, duration, opponent profile, locale)
- Session azonosito (sessionStorage alap, nem account ID)
- Hibajelentes metadata (runtime source, error message, platform)

Forras:

- Analytics bootstrap: [src/services/analytics/index.js](../../src/services/analytics/index.js)
- Monitoring bootstrap: [src/services/monitoring/index.js](../../src/services/monitoring/index.js)
- Event matrix: [docs/analytics/event-matrix-v1.md](../analytics/event-matrix-v1.md)

## 3. Mire es milyen jogalappal kezeljuk

Javasolt jogalap launchra (egyeztetendo jogi tanacsadoval):

- Essential app function (helyi state mentes): szerzodes teljesitese / jogos erdek
- Product analytics (usage, retention): hozzajarulas vagy jogos erdek (regiofuggo)
- Error monitoring (stabilitas, bugfix): jogos erdek

MVP dontes (2026-03-31): consent popup az MVP launch szakaszban nem kerül implementalasra. Elfogadott kockazat; elso nagyobb frissitesnel ujraertekelheto.

## 4. Harmadik felek es adattovabbitas

Jelenlegi cel stack:

- Firebase Analytics (Google)
- Sentry (web + Android WebView monitoring)

Reszletek a [docs/release/day21-data-disclosure-matrix.md](day21-data-disclosure-matrix.md) dokumentumban.

## 5. Adatmegorzes

Draft javaslat:

- Local app state: user altal torolheto (app reset/uninstall)
- Analytics events: Firebase Analytics, max 14 honap
- Monitoring errors: Sentry, 90 nap

## 6. Erintetti jogok

Draft policyba keruljon:

- Tajekoztatas, hozzaferes, helyesbites, torles, korlatozas, tiltakozas
- Hozzajarulas visszavonasa (ha consent alapu analytics fut)
- Panasztetel felugyeleti hatosagnal

## 7. Gyermekek vedelme

Draft allitas:

- Az app nem celzottan gyerekeknek keszul
- 13 ev alatti felhasznalokra vonatkozo helyi szabalyokat (COPPA / regio-specifikus) kulon ellenorizni kell

## 8. Biztonsagi intezkedesek

- Third-party provider SDK security baseline
- Minimal adatelv gyakorlat
- Local persistence only where needed
- Access kontroll release pipelineban
- A jelenlegi telemetry eventek a kodalap alapjan nem kuldenek playerName / nickname mezot analytics payloadban; a felhasznaloi nev lokalis UI- es leaderboard-adatkent marad

## 9. Frissitesek

- Policy last-updated datum kotelezo
- Lenyegi valtozasoknal in-app changelog / policy update notice javasolt

## 10. Publish elotti kotelezo placeholder kitoltes

A kovetkezok hianyoznak, publish elott kotelezo:

- [x] Legal entity adatok (Juhász Tamás, Budapest)
- [x] Privacy contact email (tamasjuhasz84@yahoo.com)
- [x] Pontos retention idotartamok providerenkent (Firebase: 14 honap, Sentry: 90 nap)
- [x] Publikus Privacy Policy URL: https://rpsls-mobile-game.vercel.app/privacy
- [ ] Regios jogalap veglegesites (EEA/UK/US)
- [ ] Data transfer safeguard szoveg (ha EEA -> US transfer van)
