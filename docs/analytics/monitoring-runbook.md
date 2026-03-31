# Monitoring Runbook

Datum: 2026-03-31 (V2 Day 1)
Statusz: Veglegesitett

---

## 1. Backend strategia platformonkent

| Platform      | Backend | Feltetel                       |
| ------------- | ------- | ------------------------------ |
| web           | sentry  | VITE_SENTRY_DSN env beallitva  |
| android       | sentry  | VITE_SENTRY_DSN env beallitva  |
| web / android | console | DSN nincs beallitva (dev / CI) |

> **Megjegyzes**: A `crashlytics_pending` allapot megszunt. A Sentry @sentry/vue SDK
> Capacitor WebView kornyezetben is teljes erteku JS exception trackinget vegez.
> Natív Android Crashlytics bridge V2-ben nem szukseges.

`app_start` event tartalmazza a `monitoring_backend` erteket — dashboard szures alapja.

---

## 2. Kritikus alertek es kuszobertekek

| Alert                              | Kuszob    | Jelentes                                  |
| ---------------------------------- | --------- | ----------------------------------------- |
| Crash-free sessions                | < 99.5%   | Stabilizacios beavatkozas szukseges       |
| match_start / session_start arany  | < 0.4     | Home CTA vagy onboarding problema         |
| match_end / match_start arany      | < 0.85    | Gameplay megszakadas vagy stability issue |
| daily_complete / daily_start arany | < 0.3     | UX vagy logikai hiba a napi kihivasban    |
| error_captured volume spike        | > 5x alap | Azonnali vizsgalat                        |

---

## 3. Hibabesorolasi folyamat

### 3.1 Crash / fatal error esete

1. Sentry alertet kap → megnyitni a legfrissebb event-et
2. Ellenorizni: `source` field (vue_error / window_error / promise_rejection)
3. Ellenorizni: `platform` (web / android), `session_id` (rintezi-e ugyanaz a session)
4. Firebase Analyticsben: szurt `error_captured` eventeknel ugyanazon `session_id` mit jelez
5. Donteni: hotfix szukseges-e (rollback trigger lent)

### 3.2 Funnel-drop esete

1. Dashboard Panel 3 megnyitasa: home → game → match_start → match_end
2. Azonositani, melyik atmeneten esik a leginkabb
3. Ha match_start → match_end nagy drop: Session Recording / logok
4. Ha session_start / match_start arany alacsony: Home panel UX vizsgalat

---

## 4. Rollback trigger kovetelmenyek

Rollback indokolt ha:

- Crash-free sessions 2 egymast koveto 30-perces ablakban < 98%
- Tobb Sentry event erkezik ugyanarrol a nem kezelt hibarul (> 10 felhasznalo erint)
- match_end / match_start arany > 15%-ot esik az alap utan

Rollback lepesek:

1. Play Console → Releases → Halt rollout
2. Sentry-ben: release-t archivalva jelolni
3. Belso Slack / kommunikacio: statusz megosztasa

### 4.1 Rollback trigger gyakorlat (drill)

Az alabbi szcenariok vegigvezethetok valos rollout nelkul, csak a
dashboardok es dokumentumok hasznalataval.

---

**Szcenario A — Crash spike T+2h utan**

_Trigger:_ Crash-free sessions 30 percen belul 97.5%-ra esik.

| Lepes | Muvelet                                                                    | Ellenorzes                         |
| ----- | -------------------------------------------------------------------------- | ---------------------------------- |
| 1     | Sentry megnyitasa: legfrissebb exception group azonositasa                 | Van-e >5 unique user?              |
| 2     | `source` mezo leolvasasa: vue_error / window_error / promise_rejection     | Melyik path erinti?                |
| 3     | Firebase: `error_captured` szures `platform=android` + `app_version=0.1.0` | Egyezik-e a Sentry grouppal?       |
| 4     | Ha reprodukalható: Play Console → Production → Halt rollout                | Megerosites: rollout megall        |
| 5     | Hotfix agan patch, rebuild, AAB feltoltes draft release-kent               | NE publikald meg                   |
| 6     | Internal test tracken validalas (>2 eszkoz)                                | Crash-free?                        |
| 7     | Ha igen: staged rollout ujrainditasa                                       | Rollout % beallitasa 5%-ra eloszor |

---

**Szcenario B — Funnel-drop T+24h utan (match_start / session_start < 0.30)**

_Trigger:_ match_start / session_start arany 0.30 ala esik (cel 0.40).

| Lepes | Muvelet                                                                                              | Ellenorzes                                  |
| ----- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1     | Firebase Funnel panel: screen_view(home) → screen_view(game) atvalas megtortenik?                    | Ha home → game drop is nagy: Home CTA hiba  |
| 2     | Ha home → game rendben, de game → match_start gyenge: GameView onMounted vizsgalat                   | resumeTournamentFlow / startGameLoop fut-e? |
| 3     | Dev eszkozrol DebugView-ban manualis session vegigjarasa                                             | match_start megjelenik-e?                   |
| 4     | Ha nem: GameView.vue `startGameLoop` guard log vizsgalat (matchFinished / currentOpponent guard)     |                                             |
| 5     | Ha reprodukalható release build hiban: Play Console rollout pajzsolasa (nem rollback, csak megallas) |                                             |
| 6     | Patch + internal track teszt, majd rollout folytatas                                                 |                                             |

---

**Szcenario C — match_end / match_start arany < 0.70 (gameplay megszakadas)**

_Trigger:_ match_end eventek szama tul alacsony match_start-hoz kepest.

| Lepes | Muvelet                                                                     | Ellenorzes                                    |
| ----- | --------------------------------------------------------------------------- | --------------------------------------------- |
| 1     | Sentry: van-e exception a phase watcher vagy resolveRound fuggvenyek korul? |                                               |
| 2     | Firebase: match_end.result distribucio: van-e "ai" tul dominans?            | Ha igen: gameplay balance problema, nem crash |
| 3     | match_end.duration_sec eloszlas: vannak-e 0 masodperces ertekek?            | 0 = match_start utan azonnali megszakadas     |
| 4     | Dev eszkozrol bo3 meccs vegigjarasa DebugView figyelese mellett             | match_end megjelenik?                         |
| 5     | Ha release build specikus: staged rollout pause + patch                     |                                               |

---

**Drill osszegzes — sikerkriteriumok**

A drill sikeres, ha a fejleszto kepes:

- 5 percen belul azonositani az alert forrast (Sentry vs Firebase vs Play Console)
- 15 percen belul donteni: rollback / pause / monitoring folytatas
- 30 percen belul elkezdeni a konkret vizsgalatot (DebugView, log, patch)

---

## 5. Error event payload referencia

Az `error_captured` analytics event mezon:

| Mezo               | Tipus  | Leiras                                         |
| ------------------ | ------ | ---------------------------------------------- |
| source             | string | vue_error \| window_error \| promise_rejection |
| monitoring_backend | string | sentry \| console                              |
| platform           | string | web \| android \| ios                          |
| session_id         | string | Sessionhoz kotott azonosito                    |
| message            | string | Error.message tartalom                         |

Sentry `extra` mezok (csak Sentry-ben, Analytics-ben nem):

| Mezo                      | Kuldesi helyzet                   |
| ------------------------- | --------------------------------- |
| filename / lineno / colno | window_error esetén               |
| info                      | vue_error esetén (component info) |

---

## 6. Eszkozok es linkek

| Eszköz                        | Cel                                           |
| ----------------------------- | --------------------------------------------- |
| Sentry project dashboard      | Exception tracking (web + android)            |
| Firebase Analytics DebugView  | Esemenyek real-time ellenorzese dev eszkozrol |
| Firebase Analytics dashboard  | Funnel es retention meresek                   |
| Play Console → Android Vitals | Natív ANR / native crash proxy                |

> Play Console Android Vitals marad a natív crash (JVM / NDK szintu) egyetlen forrasakent,
> de a RPSLS alkalmazas logikajanak hibait a Sentry JS layer kapja el.

---

## 7. Ellenorzesi lista launch utan

- [ ] Sentry-ben `environment=production` eventeket lat app_version=0.1.0 felett
- [ ] Firebase: `error_captured` eventeknel `platform=android` megjelenik
- [ ] `monitoring_backend=sentry` az `app_start` eventben
- [ ] Crash-free arany > 99.5% az elso 24h utan
- [ ] Nincs `crashlytics_pending` string sehol a codebase-ben
