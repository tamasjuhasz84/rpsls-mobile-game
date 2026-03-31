# Rock, Paper, Scissors, Lizard, Spock (RPSLS)

Mobile-first single-player RPSLS tournament game built with Vue 3 and Vite.

Current release focus:

- Stable local gameplay loop
- Fast round pacing
- Persistent continue flow
- Portfolio-ready project structure and docs

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Build production bundle

```bash
npm run build
```

4. Optional: preview production build

```bash
npm run preview
```

5. Run test suite

```bash
npm test
```

## Feature Overview (User Facing)

### Core gameplay

- Classic RPSLS rules with quick round resolution
- Countdown-based round lock and reveal sequence
- Multiple AI opponents in bracket progression

### Game modes

- Best of 3
- Best of 5
- Survival mode
- Daily challenge run

### Progression and retention loops

- Daily missions with progress + claim flow
- Daily challenge status tracking
- Local leaderboard (daily + all-time)
- Session stats (wins/losses/draws/win rate/streak)

### Quality of life

- Continue from saved tournament state
- Hungarian and English language support
- Responsive home and game layouts for mobile and desktop

## User Guide (Short)

### Home screen

1. Enter player name.
2. Choose mode (BO3, BO5, Survival).
3. Tap Start to begin a new run.
4. Tap Continue if a valid saved run exists.
5. Expand extra panels when needed (Daily, Missions, Stats, Leaderboard).

### Game screen

1. Select your move before countdown ends.
2. After reveal, check round result and explanation.
3. Continue until match target is reached.
4. Advance to next opponent after a match win.

### Bracket and rules

- Bracket screen shows opponent progression.
- Rules screen lists all RPSLS outcomes.

### Privacy and terms

- Privacy page: /privacy
- Terms page: /terms

## Product Positioning

- No ads
- No paid advantage
- No pay-to-win mechanics

The game is designed as a skill-first single-player experience with transparent progression.

## Developer

Developed by Tamas Juhasz as an independent portfolio-focused project.

## Contact

Feedback and collaboration:

- tamasjuhasz84@yahoo.com

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

If saved tournament payload is valid, Continue resumes from the stored round.

## Release Status

- Web app flow: stable
- Core smoke tests: passing
- Android wrapper pipeline: configured
- Compliance docs and legal routes: present

## License

License to be defined.
