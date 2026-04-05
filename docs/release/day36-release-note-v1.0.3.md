# Release Note - v1.0.3 (Play Console)

Datum: 2026-04-05
Statusz: Ready to paste into Play Console
Build scope: Stability + UX/readability polish + release hardening

## Play Console short note (HU)

Javitottuk a jatek stabilitasat (duplikalt koreredmeny kezeles, serult mentett allapot vedelme), finomitottuk a Home/Game UX-et es olvashatosagot, valamint erositettuk az Android release pipeline es monitoring alapokat a biztosabb kiadashoz.

## Play Console short note (EN)

This update improves gameplay stability (duplicate round-result protection, corrupted save-state handling), refines Home/Game UX and readability, and strengthens Android release pipeline and monitoring baselines for a safer rollout.

## Full release summary

### Added

- Opponent archetypes with richer AI flavor and naming variety.
- Survival mode, local leaderboard, and shareable result flow.
- Android release pipeline scripts for sync and AAB generation.
- Day 24 release process documentation for signing, versioning, and internal testing.
- Day 20 closeout documentation bundle (KPI summary, go/no-go refresh decision, V2 wrap-up, V3 backlog seed).
- Day 31 Play Console Data Safety answer sheet for manual console submission.
- Day 31 manual release-gate runbook for remaining external blockers.

### Changed

- Home and game UX polish, spacing, readability, and accessibility coverage.
- Android release build flow updated for env-based signing configuration.
- Monitoring dashboard baseline cleaned up for soft-launch readout consistency.
- Retention copy, continue-flow messaging, and opponent personality text refined in HU/EN locales.
- Survival pacing and score readability tuned for clearer progression feedback.
- Release upload playbook now references the maintained Day 29 release note source.
- Privacy/compliance drafts upgraded with finalized legal basis and EEA transfer safeguard wording.
- Legal/compliance checklists now mark OSS license audit, NOTICE check, and asset provenance as completed based on repo evidence.

### Fixed

- Store-level round result dedup guard to avoid duplicate processing in remount edge cases.
- Game-state loader now rejects invalid non-object payloads and clears corrupted persisted state.
- Analytics event payload validation tightened for required fields and empty critical values.
- Test-mode analytics debug noise reduced to keep CI/test output clean.

## Known limitations

- Crash backend is currently Sentry-focused; Crashlytics bridge is not yet active.
- Retention trend interpretation still depends on post-rollout data volume.
