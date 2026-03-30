# Day 21 - Data Disclosure Matrix (Play Store prep)

Datum: 2026-03-30
Statusz: Draft v1

## 1. Osszefoglalo

Ez a matrix a jelenlegi kodalap alapjan keszult disclosure draft. Veglegesites elott jogi + release owner review kotelezo.

## 2. Data type matrix

| Data tipus                 | Peldak                                                                         | Forras              | Celu                                   | Megorzes                                 | Megosztas third-partyval                                      |
| -------------------------- | ------------------------------------------------------------------------------ | ------------------- | -------------------------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| App activity               | screen_view, match_start, match_end, tournament_end, continue_click, daily\_\* | app telemetry       | Product analytics, retention, funnel   | Provider retention policy szerint        | Igen (Firebase)                                               |
| App diagnostics            | error message, source, platform metadata                                       | runtime monitoring  | Stabilitas, hibajavitas                | 90-180 nap javasolt                      | Igen (Sentry web, Crashlytics Android target)                 |
| Device/session identifier  | session_id (sessionStorage), app/platform metadata                             | analytics bootstrap | Session-level analysis, dedup          | Session + provider retention             | Igen (analytics provider)                                     |
| In-app progress (local)    | tournament state, daily/mission/leaderboard local state                        | localStorage        | Continue flow, user UX                 | User device-en marad                     | Nem (by default)                                              |
| User-provided display data | playerName (nickname)                                                          | home input          | In-app megjelenites, local leaderboard | User device-en + local leaderboard state | Nem kozvetlenul, kiv ha event payloadba kerül (ellenorizendo) |

## 3. Provider matrix

| Provider                    | Funkcio                         | Kulfoldi adattovabbitas kockazat | Notes                                      |
| --------------------------- | ------------------------------- | -------------------------------- | ------------------------------------------ |
| Firebase Analytics (Google) | Event tracking                  | Lehetseges                       | GDPR/EEA transfer safeguards ellenorizendo |
| Sentry                      | Web error monitoring            | Lehetseges                       | DSN only when configured                   |
| Crashlytics (pending)       | Android native crash monitoring | Lehetseges                       | Integracio roadmapban pending              |

## 4. Data safety questionnaire draft input (Play Console)

Elso koros javaslat, validalando:

- Data collected: Yes (analytics + diagnostics)
- Data shared: Yes (providers)
- Data encrypted in transit: Yes (provider SDK default expected)
- Data deletion request support: Partial/To be defined (account nelkuli app; policy process kell)

## 5. Ellenorzendo pontok release elott

- [ ] Pontos provider retention idok
- [ ] EEA consent strategia analyticsre
- [ ] Player name event payloadban valoban nem kerul ki (event audit)
- [ ] Play Console Data Safety valaszok osszehangolasa a policy texttel
- [ ] Android Crashlytics aktiv statusz ujraellenorzese
