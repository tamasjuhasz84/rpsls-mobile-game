# Day 27 - Top 5 UX Friction Points

Datum: 2026-03-30
Statusz: Identified from current code and launch readiness state

## 1. Daily challenge panel competes with the main start CTA

Why it matters:

- The home screen presents player naming, mode selection, daily challenge, missions, start/continue, stats, leaderboard, and language switch in one long hero flow.
- Early users may not immediately understand whether the primary path is standard run or daily challenge.

Relevant code:

- src/views/HomeView.vue

Risk signal:

- session_start present, but low daily_start and low first match start rate

## 2. Continue flow may feel ambiguous on first launch or after partial runs

Why it matters:

- Continue is present alongside start, but the saved tournament logic depends on multiple state conditions.
- New or returning users may not understand when resume is valid or what exactly will resume.

Relevant code:

- src/views/HomeView.vue
- src/views/GameView.vue

Risk signal:

- continue_click low or confused usage, plus resume-related drop after home screen

## 3. Tutorial has 5 full steps before completion

Why it matters:

- The tutorial overlay is modal and step-based.
- It supports skip, but first-session users may still perceive it as too long before gameplay payoff.

Relevant code:

- src/stores/tutorial.js
- src/components/ui/TutorialOverlay.vue

Risk signal:

- high tutorial_skip, low first match completion, early churn after first launch

## 4. Match-end screen has many competing actions

Why it matters:

- Motivation panel, next action, secondary action, reward claim, share card, streak highlight, and status text are all present in one post-match area.
- This can reduce clarity on the single next-best action.

Relevant code:

- src/views/GameView.vue

Risk signal:

- healthy match_end, but weak continue_click, weak daily_claim, weak share_click

## 5. Share flow depends on platform capability and fallback path clarity

Why it matters:

- Native share, clipboard, cancelled path, and clipboard fallback all exist.
- If sharing is not supported or the user cancels, the value of the action may not feel strong enough.

Relevant code:

- src/views/GameView.vue

Risk signal:

- share_click mostly cancelled or near zero despite tournament completions
