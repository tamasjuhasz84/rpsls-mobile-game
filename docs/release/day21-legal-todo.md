# Day 21 - Legal TODO + Terms/Attribution Check

Datum: 2026-03-31
Statusz: In progress (2026-03-31 adatokkal frissitve)

## A) Privacy/Compliance TODO (P0)

- [x] Privacy Policy v1 finalizalasa (placeholder adatok kitoltve, Draft v3)
- [x] Terms of Use draft keszitese (disclaimer, liability, governing law)
- [ ] Data Safety form kitoltese Play Console-ban
- [x] EEA/UK analytics consent dontes: MVP launch szakaszban nincs consent popup (elfogadott kockazat)
- [x] Contact csatorna rogzitve (tamasjuhasz84@yahoo.com)

## B) Terms of Use minimum tartalom

- [x] Szolgaltatas leirasa (single-player game, no warranty)
- [x] Felhasznaloi magatartas szabalyok
- [x] IP jogok es tartalmak hasznalata
- [x] Third-party szolgaltatokra hivatkozas
- [x] Felelossegkorlatozas
- [x] Policy valtoztatas menete

## C) Attribution / OSS dependency check

Top-level package inventory (npm ls --depth=0):

- @capacitor/android@7.6.1
- @capacitor/cli@7.6.1
- @capacitor/core@7.6.1
- @capacitor/splash-screen@7.0.5
- @capacitor/status-bar@7.0.6
- @sentry/vue@10.46.0
- @vitejs/plugin-vue@5.2.4
- firebase@12.11.0
- jsdom@29.0.1
- pinia@2.3.1
- vite-plugin-pwa@1.2.0
- vite@6.4.1
- vitest@4.1.2
- vue-i18n@9.14.5
- vue-router@4.6.4
- vue@3.5.30

Required check release elott:

- [ ] Minden runtime dependency licenc tipus validalasa (MIT/Apache/BSD/egyeb)
- [ ] NOTICE kotelezettseg ellenorzese (ha van)
- [ ] In-app vagy store listing attribution szukseges-e
- [ ] Sajat assetek (ikonok/hatterek) jogtisztasag igazolasa

## D) Release gate (go/no-go)

- [x] Privacy Policy URL: https://rpsls-mobile-game.vercel.app/privacy
- [x] Terms URL: https://rpsls-mobile-game.vercel.app/terms
- [ ] Data Safety form osszhangban a matrix-szal
- [ ] Internal legal review sign-off
- [ ] Build metadata/frissites datumok egyeznek a policy oldalakkal

## E) Recommendation for Day 22 handoff

- Day 22 store copy keszitese elott a policy/terms URL-ek legyenek fixek,
  mert a listing szovegbe mar ezekre kell hivatkozni.

## F) 2026-03-31 repo audit eredmeny

- Terms draft elkeszult: [day21-terms-of-use-draft.md](day21-terms-of-use-draft.md)
- Monitoring backend allapot: Sentry web + Android WebView, Crashlytics bridge nincs aktivra kotve
- Player name telemetry audit: analytics event payloadban nem talalhato playerName / nickname mezo
- Tovabbi blokkolo: jogi/contact placeholder adatok, publikus URL-ek, retention es consent dontes
