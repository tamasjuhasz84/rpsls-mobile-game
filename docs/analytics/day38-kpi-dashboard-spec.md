# Day 38 - Monitoring KPI Dashboard Specification

Date: 2026-04-05
Scope: Product + technical KPI dashboard for release monitoring

## Objective

Create one dashboard that links product outcomes to technical health so release decisions are data-driven.

## KPI Groups

### 1) Acquisition and session health

1. Session starts (`session_start` count)
2. Daily active users (derived)
3. Session duration median (derived from start/end events)

### 2) Core gameplay funnel

1. Home -> game start conversion
2. Continue usage rate (`continue_click` on home/game)
3. Match completion rate (`match_start` -> `match_end`)
4. Tournament completion rate (`match_start` -> `tournament_end`)

### 3) Daily challenge performance

1. Daily challenge start count (`daily_start`)
2. Daily completion rate (`daily_complete`)
3. Daily reward claim rate (`daily_claim` after won)

### 4) Quality and reliability

1. Captured runtime errors per 1k sessions (`error_captured`)
2. Crash-free session proxy (sessions without fatal error events)
3. Resume failure rate (from in-app resume error signal)

### 5) Engagement and retention proxies

1. Share action rate (`share_click` per tournament end)
2. Mission claim rate (`mission_claim`)
3. Return sessions D1 proxy (repeat session in next day window)

## Event-to-KPI Mapping

Primary event sources:
1. `session_start`
2. `screen_view`
3. `continue_click`
4. `match_start`
5. `match_end`
6. `tournament_end`
7. `daily_start`
8. `daily_complete`
9. `daily_claim`
10. `share_click`
11. `mission_claim`
12. `error_captured`

## Suggested Dashboard Panels

1. Funnel panel: Home -> Match start -> Match end -> Tournament end
2. Daily challenge panel: starts, completions, claims, win/loss split
3. Reliability panel: error rate trend, top sources, platform split
4. Engagement panel: share and mission claim ratios
5. Locale split panel: HU vs EN behavior comparison

## Alert Threshold Proposals (initial)

1. Error rate > 10 / 1k sessions for 2 consecutive hours -> warning
2. Tournament completion drops by > 20% vs 7-day median -> warning
3. Daily claim conversion < 60% after wins for 24h -> investigate

## Operational Cadence

1. Daily review: runtime errors + funnel drop checks
2. Weekly review: retention proxies, locale differences, feature impact
3. Release-day review: 2h, 24h, 72h checkpoints

## Data Quality Rules

1. All KPI queries must filter invalid or missing required event payloads.
2. Session-based ratios should use unique `session_id` where possible.
3. Dashboard notes must annotate major release timestamps.

## Next Steps

1. Implement dashboard in preferred analytics backend.
2. Link each alert to runbook owner and remediation path.
3. Add KPI snapshot section to release observation package.
