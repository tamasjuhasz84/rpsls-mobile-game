# Day 26 - Monitoring Dashboard Setup

Datum: 2026-03-30
Statusz: Cleaned-up on Day 29 (RC-ready baseline)
Goal: Egy minimal, launch-heti dashboard, ami eleg a crash/session/retention proxy gyors olvasasahoz.

## 1. Core metrics to pin

- Crash-free sessions
- session_start count
- screen_view home -> game funnel
- match_start count
- match_end count
- tournament_end count
- continue_click count
- daily_start count
- daily_complete count
- share_click count

## 2. First dashboard panels

Panel 1:

- Sessions by day
- Split by platform and locale

Panel 2:

- Crash-free trend by app version
- Error volume by backend/platform

Panel 3:

- Funnel: home view -> game view -> match_start -> match_end -> tournament_end

Panel 4:

- Session quality proxies:
  - matches per session
  - tournament completions per session
  - continue_click usage

Panel 5:

- Feature adoption:
  - daily challenge starts/completions
  - survival usage
  - share clicks

## 3. Segments to prepare

- app_version = 0.1.0
- platform = android
- locale = en / hu
- country = soft-launch country set

## 4. Alert thresholds

- Crash-free sessions visibly below 99.5% target direction
- session_start volume present, but match_start unusually low
- match_start high, match_end low: possible gameplay interruption or crash
- daily_start present, daily_complete near zero: possible UX or logic issue

## 5. Data source mapping

Based on current implementation:

- Analytics service: src/services/analytics/index.js
- Monitoring service: src/services/monitoring/index.js
- Event baseline: docs/analytics/event-matrix-v1.md

## 6. Launch-day checklist

- [x] session_start visible for Android build
- [x] screen_view flowing from home and game
- [x] match_start and match_end both present
- [x] error capture visible when failures occur
- [x] dashboard filtered to launch app version

## 7. Day 29 clean-up summary

- Event naming aligned with event matrix v1 (no ad-hoc aliases).
- Funnel panels pinned in stable order: home -> game -> match_start -> match_end -> tournament_end.
- Segment defaults pinned for app_version/platform/locale to speed up first soft-launch readouts.
- Alert notes clarified to distinguish traffic drop vs gameplay interruption signals.
