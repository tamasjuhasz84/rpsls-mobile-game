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
