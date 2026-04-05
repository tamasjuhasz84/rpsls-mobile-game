# [1.3.0](https://github.com/tamasjuhasz84/rpsls-mobile-game/compare/v1.2.0...v1.3.0) (2026-04-05)

### Features

- **governance:** complete week 4 package with release governance, stricter lint policy, and recruiter case study ([287a195](https://github.com/tamasjuhasz84/rpsls-mobile-game/commit/287a19554f1dfb25b36c0f42dcb21fb88013b515))

# [1.2.0](https://github.com/tamasjuhasz84/rpsls-mobile-game/compare/v1.1.0...v1.2.0) (2026-04-05)

### Features

- **perf-docs:** add week 3 quality package with bundle budget gate, a11y audit baseline, and KPI dashboard spec ([64ea95b](https://github.com/tamasjuhasz84/rpsls-mobile-game/commit/64ea95b4d9870995bf96e52c574cc6a88120e92d))

# [1.1.0](https://github.com/tamasjuhasz84/rpsls-mobile-game/compare/v1.0.0...v1.1.0) (2026-04-05)

### Features

- **quality:** establish readiness baseline with CI, coverage gates, E2E, architecture map and ADRs ([3f5dd7a](https://github.com/tamasjuhasz84/rpsls-mobile-game/commit/3f5dd7af70252e12b5a50185eb42b49ce5ab1cf1))

# 1.0.0 (2026-04-05)

### Bug Fixes

- add skipWaiting/clientsClaim, gitattributes for PNG binary safety ([4e8e37d](https://github.com/tamasjuhasz84/rpsls-mobile-game/commit/4e8e37da871c80cd499f5f2ddcd728e2bbc5db04))

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- TBD

### Changed

- TBD

### Fixed

- TBD

## [1.0.3] - 2026-04-05

### Week 3-4 Release Closeout (Day 11-16)

#### Added

- Opponent archetypes with richer AI flavor and naming variety.
- Survival mode, local leaderboard, and shareable result flow.
- Day 24 Android release pipeline scripts for sync and AAB generation.
- Day 24 release process documentation for signing, versioning, and internal testing.
- Day 20 closeout documentation bundle: final KPI status summary, go/no-go refresh decision, V2 wrap-up note, and V3 backlog seed.
- Day 31 Play Console Data Safety answer sheet for manual console submission.
- Day 31 manual release-gate runbook covering remaining external blockers.

#### Changed

- Home and game UX polish, spacing, readability, and accessibility coverage.
- Android release build now supports env-based signing configuration.
- Monitoring dashboard baseline cleaned up for soft-launch readout consistency.
- Retention copy, continue-flow messaging, and opponent personality text were refined in both HU/EN locales.
- Survival pacing and score readability were tuned for clearer progression feedback.
- Release upload playbook now references the maintained Day 29 release note source.
- Privacy/compliance drafts were upgraded with finalized regional legal basis and EEA transfer safeguard wording.
- Legal TODO and compliance checklists now mark OSS license audit, NOTICE check, and asset provenance as completed based on repo evidence.

#### Removed

- Archived early analytics draft docs that were superseded by finalized monitoring/release documentation.
- Removed obsolete Day 25 internal test release notes document after consolidation into finalized release artifacts.

#### Fixed

- Store-level round result dedup guard to avoid duplicate processing in remount edge cases.
- Game-state loader now rejects invalid non-object payloads and clears corrupted persisted state.
- Analytics event payload validation was tightened for required fields and empty critical values.
- Test-mode analytics debug noise was reduced to keep CI/test output clean.
