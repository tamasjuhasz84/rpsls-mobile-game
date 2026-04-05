# Rock, Paper, Scissors, Lizard, Spock (RPSLS)

Mobile-first single-player RPSLS tournament game built with Vue 3 and Vite.

Release focus:

- Stable local gameplay loop
- Fast round pacing
- Persistent Continue flow
- Portfolio-ready documentation and release process

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Run tests

```bash
npm test
```

4. Build production bundle

```bash
npm run build
```

5. Optional: preview production build

```bash
npm run preview
```

## User-Facing Features

### Core gameplay

- Classic RPSLS rules with quick round resolution
- Countdown-based lock and reveal sequence
- AI opponents with archetype personalities

### Modes

- Best of 3
- Best of 5
- Survival
- Daily challenge

### Progression loops

- Daily missions with progress and claim flow
- Daily challenge status tracking
- Local leaderboard (daily and all-time)
- Session stats (wins/losses/draws/win rate/streak)

### Quality of life

- Continue from valid saved tournament state
- Hungarian and English language support
- Responsive layout on mobile and desktop

## User Guide

For the finalized user-facing documentation (HU/EN), see:

- [docs/user-guide-hu-en.md](docs/user-guide-hu-en.md)

In-app legal routes:

- Privacy: `/privacy`
- Terms: `/terms`

## Product Positioning

- No ads
- No paid advantage
- No pay-to-win mechanics

Skill-first single-player experience with transparent progression.

## Documentation Index

- Release closeout package v1: [docs/release/day16-release-closeout-package-v1.md](docs/release/day16-release-closeout-package-v1.md)
- Release note (latest): [docs/release/day36-release-note-v1.0.3.md](docs/release/day36-release-note-v1.0.3.md)
- Monitoring runbook: [docs/analytics/monitoring-runbook.md](docs/analytics/monitoring-runbook.md)
- Medior readiness scorecard: [docs/backlog/day37-medior-readiness-scorecard.md](docs/backlog/day37-medior-readiness-scorecard.md)
- Architecture system map: [docs/architecture/system-map.md](docs/architecture/system-map.md)
- Performance budget: [docs/architecture/performance-budget.md](docs/architecture/performance-budget.md)
- ADR index: [docs/adr/README.md](docs/adr/README.md)
- Accessibility checklist and audit: [docs/backlog/day38-accessibility-checklist-and-manual-audit.md](docs/backlog/day38-accessibility-checklist-and-manual-audit.md)
- KPI dashboard spec: [docs/analytics/day38-kpi-dashboard-spec.md](docs/analytics/day38-kpi-dashboard-spec.md)

## Quality and Release Automation

- Lint: `npm run lint`
- Auto-fix lint issues where possible: `npm run lint:fix`
- Format check (tooling/config scope): `npm run format:check`
- Full local quality gate: `npm run quality`
- Coverage report + threshold check: `npm run test:coverage`
- E2E tests (Playwright): `npm run test:e2e`
- Bundle budget check: `npm run perf:bundle-check`
- CI-style perf check (build + budget): `npm run perf:ci`

Automation in CI:

- Quality workflow: `.github/workflows/quality.yml`
- E2E workflow: `.github/workflows/e2e.yml`
- Semantic release workflow: `.github/workflows/release.yml`

Coverage thresholds are enforced in `vite.config.js` for critical application logic layers.

Semantic-release config is in `.releaserc.json` and updates `CHANGELOG.md` plus git tags/releases on main/master.

## Technical Stack

- Vue 3 (Composition API)
- Vite
- Pinia
- Vue Router
- Vue I18n
- Custom CSS
- localStorage persistence

## Project Structure

```text
src/
  components/   Reusable UI and game/tournament components
  composables/  Countdown, AI, audio, and haptics logic
  i18n/         Localization setup and hu/en message files
  router/       Route definitions
  services/     Analytics and monitoring integrations
  stores/       Pinia stores (game, tournament, UI, stats, missions)
  styles/       Global custom CSS
  utils/        Core game rules, AI engine, storage, helpers
  views/        Page-level screens (home, game, bracket, rules, legal)
```

## Persistence

Stored locally in browser storage:

- Tournament progress
- Daily challenge and mission state
- Language preference
- Player stats and leaderboard entries

Continue resumes from the stored round when the saved payload is valid.

## Developer and Contact

Developed by Tamas Juhasz as an independent portfolio-focused project.

Feedback and collaboration:

- tamasjuhasz84@yahoo.com

## License

License to be defined.
