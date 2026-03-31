# Day 31 - Play Console Data Safety Answer Sheet

Datum: 2026-03-31
Statusz: Ready for manual submit
Purpose: Gyors kitoltesi segedlet a Play Console Data Safety kerdoivhez

## 1. Scope

- App tipusa: account nelkuli, single-player game
- Data forras: app telemetry + error monitoring + local storage
- Kulso provider: Firebase Analytics, Sentry

## 2. High-level valaszok

- Does the app collect user data? Yes
- Is any collected data shared with third parties? Yes
- Is all data encrypted in transit? Yes (provider SDK default + HTTPS)
- Can users request data deletion? Partial (account nelkuli app; local data torolheto app reset/uninstall utjan)

## 3. Data category mapping

1. App activity

- Collected: Yes
- Shared: Yes (Firebase)
- Purpose: Analytics, Product improvement
- Optional: No (MVP launch setup)

2. App diagnostics

- Collected: Yes
- Shared: Yes (Sentry)
- Purpose: App functionality, Crash reporting and diagnostics
- Optional: No

3. Device/session identifier

- Collected: Yes (session-level technical identifiers)
- Shared: Yes (provider event payload)
- Purpose: Analytics dedup, diagnostics
- Optional: No

4. In-app progress (local)

- Collected to server/provider: No
- Stored locally on device: Yes

5. User-provided display data (player name)

- Collected to server/provider: No
- Stored locally on device: Yes

## 4. Consistency checks before pressing Submit

- [x] Privacy policy URL elerheto es publikusan nyithato
- [x] Terms URL elerheto es publikusan nyithato
- [x] Retention idok egyeznek (Firebase 14 honap, Sentry 90 nap)
- [x] Player name nincs analytics payloadban
- [ ] Play Console kerdoiv screenshotok mentese docs/release evidenciakent
- [ ] Final submit timestamp rogzitese day31 checklistbe

## 5. Post-submit evidence

- Javasolt screenshot nevek:
  - play-console-data-safety-overview.png
  - play-console-data-safety-categories.png
  - play-console-policy-status.png
- Javasolt hely:
  - docs/release/evidence/
