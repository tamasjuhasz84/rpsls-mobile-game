# Day 30 - Roadmap v2 Planning (Next 4 Weeks)

Datum: 2026-03-30
Statusz: Draft v1
Scope: Kovetkezo 4 het, adat-vezerelt optimalizacio

## 1. Strategic goals

- Stabilitas erosites: crash-free trend folyamatosan >= 99.5%.
- Retention javitas: D1 irany 30%+, D7 irany 10%+.
- Session depth noveles: tobblpcsos motivacios loop javitas.
- Release confidence: gyors rollback-es javitasi csatorna fenntartasa.

## 2. Week-by-week focus

### Week 1 - Soft launch telemetry hardening

- Android monitoring backend teljesitese (Crashlytics bridge vagy egyenerteku bridge).
- Dashboard valos adatra hangolasa (saved views, alert ownership, daily report ritual).
- Funnel gap triage: home -> game -> match_start -> match_end.

### Week 2 - Retention loop optimization

- Daily challenge completion lift kiserletek (copy/reward framing).
- Mission progression friction audit es tuning.
- Match-end next-best-action tovabbi egyszerusites, ha continue gyenge.

### Week 3 - Difficulty and progression tuning

- Korai AI difficulty pacing ujrakalibralas valos winrate alapjan.
- Survival score pacing tuning (reward predictability + clarity).
- Tutorial burden tuning adatok alapjan (only if skip/churn signal high).

### Week 4 - Scale-up release prep

- Store conversion A/B tanulsagok beepitese.
- Public release QA pass frissitett device matrix-szal.
- v1.1 candidate scope zarasa es release note draft.

## 3. Candidate backlog (prioritized)

P0:

- Android nativ crash telemetry veglegesites
- Resume/persist edge-case soak test bovitese
- Launch-day alert ownership + on-call response runbook

P1:

- Daily completion uplift kiserlet
- Survival engagement tuning
- Share flow copy clarity tuning

P2:

- Online leaderboard discovery spike
- Friend challenge koncept v1

## 4. Success criteria by end of v2 window

- Crash-free sessions trend stabil >= 99.5% irany
- match_start -> match_end drop csokken
- daily_start -> daily_complete ratio javul
- D1 retention early signal javulo trendet mutat
