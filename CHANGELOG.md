# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Opponent archetypes with richer AI flavor and naming variety.
- Survival mode, local leaderboard, and shareable result flow.
- Day 24 Android release pipeline scripts for sync and AAB generation.
- Day 24 release process documentation for signing, versioning, and internal testing.

### Changed

- Home and game UX polish, spacing, readability, and accessibility coverage.
- Android release build now supports env-based signing configuration.
- Monitoring dashboard baseline cleaned up for soft-launch readout consistency.

### Fixed

- Store-level round result dedup guard to avoid duplicate processing in remount edge cases.
- Game-state loader now rejects invalid non-object payloads and clears corrupted persisted state.
