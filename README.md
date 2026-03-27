# Rock, Paper, Scissors, Lizard, Spock (RPSLS)

Mobile-first single-player RPSLS tournament game built with Vue 3 and Vite.  
The project focuses on fast rounds, clear progression, and persistent local progress.

## Features

- Single-player tournament mode with bracket progression
- Best of 3 and Best of 5 match formats
- Countdown-based round flow with timed locking/reveal
- AI opponents with profile-based behavior patterns
- Hungarian and English localization (hu/en)
- Persistent continue flow via localStorage
- Match statistics tracking (wins, losses, draws, win rate, streaks)
- Responsive, mobile-first UI with custom CSS
- SVG-based move and UI icons

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Pinia
- Vue Router
- Vue I18n
- Custom CSS
- localStorage (client-side persistence)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build (optional)

```bash
npm run preview
```

## Project Structure

Brief overview of key folders:

```text
src/
	components/   Reusable UI and game/tournament components
	composables/  Countdown, AI, audio, and haptics logic
	i18n/         Localization setup and hu/en message files
	router/       Route definitions
	stores/       Pinia stores (game, tournament, UI, stats)
	styles/       Global custom CSS
	utils/        Core game rules, AI engine, storage, asset helpers
	views/        Page-level screens (home, game, bracket, rules)
```

## Game Overview

The player starts or resumes a tournament, then faces opponents in bracket order.  
Each round is timed: select a move before countdown ends, reveal both moves, resolve the result, and continue until the match target is reached.  
Winning advances to the next bracket node; losing ends the current tournament run.

## Persistence

The app stores tournament progress, UI preferences, language, and stats in localStorage.  
If valid saved tournament data exists, the Continue flow resumes from the saved bracket state.

## Future Improvements

- Add automated unit/integration tests for game loop and persistence flows
- Optimize large background assets for faster first load on mobile
- Add explicit error/empty-state UX for storage-unavailable environments

## License

License to be defined.
