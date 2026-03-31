# Release Observation Package

Datum: 2026-03-31 (V2 Day 3)
Statusz: Veglegesitett sablon
Cel: Standardizalt release megfigyelesi csomag — minden soft/public launch alkalmával kitoltendo

---

## 1. Soft Launch Readout Template

### Meta (kitoltendo launch elott)

| Mezo                                | Ertek                   |
| ----------------------------------- | ----------------------- |
| Rollout timestamp (UTC)             |                         |
| App version                         | 0.1.0 (version code: 1) |
| Rollout szazalek                    | 5%                      |
| Celorszagok                         |                         |
| Alap crash-free arany (pre-rollout) | > 99.5% (cel)           |

---

### T+2h Readout

**Ido:** **_(UTC)_**

**Crash / stabilitasi jelzesek**

| Metrika                      | Ertek | Ertekeles                |
| ---------------------------- | ----- | ------------------------ |
| Crash-free sessions %        |       | OK / FIGYELEM / KRITIKUS |
| error_captured event db      |       | OK / FIGYELEM / KRITIKUS |
| Sentry nyitott issue-k szama |       |                          |

Ertekeles kulcs: OK = cel felett / FIGYELEM = 0.5-1% alatt / KRITIKUS = 2%+ alatt

**Session inditasi jelzesek**

| Metrika                        | Ertek | Ertekeles        |
| ------------------------------ | ----- | ---------------- |
| session_start db (Android)     |       | ERKEZIK / HIANY  |
| app_start `monitoring_backend` |       | sentry / console |
| screen_view(home) erkezik      |       | IGEN / NEM       |

**Dontes**

- [ ] Rollout folytatasa (problem mentes)
- [ ] Figyelo uzemmod (enyhe anomalia, 1 oran belul ujra ellenorizni)
- [ ] Rollout megallitasa → rollback trigger ellenorzese (monitoring-runbook.md #4)

Megjegyzes: \_\_\_

---

### T+24h Readout

**Ido:** **_(UTC)_**

**Crash / stabilitasi jelzesek**

| Metrika                 | Ertek | Ertekeles                |
| ----------------------- | ----- | ------------------------ |
| Crash-free sessions %   |       | OK / FIGYELEM / KRITIKUS |
| error_captured osszesen |       |                          |
| Sentry resolved vs open |       |                          |

**Session minoseg**

| Metrika                        | Ertek | Cel    | Ertekeles |
| ------------------------------ | ----- | ------ | --------- |
| session_start                  |       | > 0    |           |
| match_start / session_start    |       | > 0.40 |           |
| match_end / match_start        |       | > 0.85 |           |
| tournament_end / session_start |       | > 0.10 |           |
| continue_click db              |       | > 0    |           |

**Feature adopcio**

| Metrika                      | Ertek | Ertekeles  |
| ---------------------------- | ----- | ---------- |
| daily_start db               |       |            |
| daily_complete / daily_start |       | > 0.30 cel |
| share_click db               |       |            |
| mission_claim db             |       |            |

**D1 proxy (korai)**

| Kerdés                                        | Megfigyeles |
| --------------------------------------------- | ----------- |
| Visszatert felhasznalok (2+ session)          |             |
| session_start trendvonal (novekvo / csokkeno) |             |

**Dontes**

- [ ] Rollout bovitese (>10% / >20%)
- [ ] Varakozas tovabb
- [ ] Rollback → monitoring-runbook.md #4

Megjegyzes: \_\_\_

---

### T+72h Readout

**Ido:** **_(UTC)_**

**D1 proxy vegleges**

| Metrika                               | Ertek | Cel    | Ertekeles |
| ------------------------------------- | ----- | ------ | --------- |
| Uj session / uj install arany naponta |       | > 1.0  |           |
| Visszatero session szazalek           |       | > 25%  |           |
| Atlagos match_start / session         |       | > 1.5  |           |
| tournament_end / session              |       | > 0.10 |           |

**Funnel teljes kep**

```
session_start  →  screen_view(home)  →  screen_view(game)  →  match_start  →  match_end  →  tournament_end
    100%               ____%                  ____%              ____%           ____%           ____%
```

Celertekek: home > 95% / game > 60% / match_start > 55% / match_end > 46% / tournament_end > 10%

**Stabilitasi vegleges itelet**

| Metrika                             | Ertek | Ertekeles   |
| ----------------------------------- | ----- | ----------- |
| Crash-free sessions % (72h atlag)   |       | OK / NEM OK |
| Ismert Sentry issue-k szama         |       |             |
| ANR / native crash Play Console-ban |       |             |

**Dontes**

- [ ] Publikus release (100% rollout engedely)
- [ ] Korlatos rollout fenntartas + kovetkezo het javitas
- [ ] Hold — specifikus hiba javitasa elott nem terjesztheto

Megjegyzes: \_\_\_

---

## 2. KPI Report Sablon

**Cel:** Minden release utan es heti sprint-zaraskor kitoltendo KPI attekintest

### 2.1 Stabilitasi KPI-ok

| KPI                                  | Cel     | Meresi alap                   | Aktualis |
| ------------------------------------ | ------- | ----------------------------- | -------- |
| Crash-free sessions %                | > 99.5% | Sentry / Firebase Crashlytics |          |
| error_captured / session_start arany | < 0.02  | Firebase Analytics            |          |
| Sentry nyitott P0 issue-k            | 0       | Sentry dashboard              |          |

### 2.2 Session melyseg KPI-ok

| KPI                              | Cel    | Meresi alap                 | Aktualis |
| -------------------------------- | ------ | --------------------------- | -------- |
| match_start / session_start      | > 0.40 | Firebase funnel             |          |
| match_end / match_start          | > 0.85 | Firebase funnel             |          |
| tournament_end / session_start   | > 0.10 | Firebase funnel             |          |
| Atlag round_number match_end-nel | > 2.0  | match_end.rounds_played avg |          |

### 2.3 D1 proxy KPI-ok

| KPI                              | Cel    | Meresi alap          | Aktualis |
| -------------------------------- | ------ | -------------------- | -------- |
| Session return arany 24h-n belul | > 25%  | session_start kohort |          |
| Atlag session / aktiv nap        | > 1.5  | session_start / DAU  |          |
| continue_click / tournament_end  | > 0.20 | Firebase funnel      |          |

### 2.4 Feature adopcio KPI-ok

| KPI                                 | Cel    | Meresi alap | Aktualis |
| ----------------------------------- | ------ | ----------- | -------- |
| daily_complete / daily_start        | > 0.30 | Firebase    |          |
| share_click / tournament_end        | > 0.05 | Firebase    |          |
| mission_claim / session (daily mod) | > 0.20 | Firebase    |          |

### 2.5 KPI ertekelesi szabalyok

- **Cel felett**: nincs beavatkozas szukseges
- **5-15%-kal cel alatt**: backlogba kerul, kovetkezo sprint vegere javitando
- **15%+ cel alatt**: P1 prioritas, azonnali vizsgalat
- **Stabilitasi KPI barmely cel alatt**: monitoring-runbook.md #3 folyamat indul

---

## 3. Kapcsolodo dokumentumok

| Dokumentum                                      | Tartalom                                                       |
| ----------------------------------------------- | -------------------------------------------------------------- |
| docs/analytics/monitoring-runbook.md            | Alert kuszobertekek, rollback trigger, hibabesorolasi folyamat |
| docs/analytics/event-matrix-v1.md               | Analytics event taxonomia es parameterei                       |
| docs/analytics/day26-monitoring-dashboard.md    | Dashboard panel leirasok, alert ownership                      |
| docs/release/day26-release-candidate-rollout.md | Rollout inditas lepes-le-lepes                                 |
