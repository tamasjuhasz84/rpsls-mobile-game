# Day 21 - Data Disclosure Matrix (Play Store prep)

Datum: 2026-03-31
Statusz: Draft v3 (release package prepared)

## 1. Osszefoglalo

Ez a matrix a jelenlegi kodalap alapjan keszult disclosure draft. Veglegesites elott jogi + release owner review kotelezo.

## 2. Data type matrix

| Data tipus                 | Peldak                                                                         | Forras              | Celu                                   | Megorzes                                 | Megosztas third-partyval                                 |
| -------------------------- | ------------------------------------------------------------------------------ | ------------------- | -------------------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| App activity               | screen_view, match_start, match_end, tournament_end, continue_click, daily\_\* | app telemetry       | Product analytics, retention, funnel   | Firebase: max 14 honap                   | Igen (Firebase)                                          |
| App diagnostics            | error message, source, platform metadata                                       | runtime monitoring  | Stabilitas, hibajavitas                | Sentry: 90 nap                           | Igen (Sentry web + Android WebView target)               |
| Device/session identifier  | session_id (sessionStorage), app/platform metadata                             | analytics bootstrap | Session-level analysis, dedup          | Session + provider retention             | Igen (analytics provider)                                |
| In-app progress (local)    | tournament state, daily/mission/leaderboard local state                        | localStorage        | Continue flow, user UX                 | User device-en marad                     | Nem (by default)                                         |
| User-provided display data | playerName (nickname)                                                          | home input          | In-app megjelenites, local leaderboard | User device-en + local leaderboard state | Nem; repo audit alapjan analytics payloadba nem kerul be |

## 3. Provider matrix

| Provider                    | Funkcio          | Kulfoldi adattovabbitas kockazat | Notes                                                  |
| --------------------------- | ---------------- | -------------------------------- | ------------------------------------------------------ |
| Firebase Analytics (Google) | Event tracking   | Lehetseges                       | GDPR/EEA transfer safeguards ellenorizendo             |
| Sentry                      | Error monitoring | Lehetseges                       | DSN only when configured; web + Android WebView target |

## 4. Data safety questionnaire draft input (Play Console)

Elso koros javaslat, validalando:

- Data collected: Yes (analytics + diagnostics)
- Data shared: Yes (providers)
- Data encrypted in transit: Yes (provider SDK default expected)
- Data deletion request support: Partial/To be defined (account nelkuli app; policy process kell)

## 5. Ellenorzendo pontok release elott

- [x] Pontos provider retention idok (Firebase Analytics: 14 honap, Sentry: 90 nap)
- [x] EEA consent strategia analyticsre (MVP: nincs popup, elfogadott kockazat)
- [x] Player name event payloadban valoban nem kerul ki (repo audit: src/views/HomeView.vue, src/views/GameView.vue, src/services/analytics/index.js)
- [ ] Play Console Data Safety valaszok osszehangolasa a policy texttel (answer sheet kesz)
- [x] Android Crashlytics aktiv statusz ujraellenorzese (nem aktiv; Sentry az ervenyes monitoring backend)
