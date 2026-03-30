import { MOVES } from "./gameRules.js";
import {
  createSeededRandom,
  getDailyChallengeDateKey,
  hashStringToSeed,
} from "./dailyChallenge.js";

function pickRoundWinsTarget(random) {
  return random() > 0.55 ? 5 : 3;
}

function pickStreakTarget(random) {
  return random() > 0.5 ? 3 : 2;
}

function pickMove(random) {
  const index = Math.floor(random() * MOVES.length);
  return MOVES[index] || "rock";
}

function createMission({ dateKey, index, type, target, meta = {} }) {
  const move = meta.move || "any";
  const code = `${type}:${target}:${move}`;

  return {
    id: `${dateKey}-${index + 1}`,
    code,
    type,
    target,
    progress: 0,
    completed: false,
    claimed: false,
    completedAt: 0,
    claimedAt: 0,
    meta,
  };
}

export function buildDailyMissionPack(date = new Date()) {
  const dateKey = getDailyChallengeDateKey(date);
  const seed = hashStringToSeed(`mission:${dateKey}`);
  const random = createSeededRandom(seed);

  const roundTarget = pickRoundWinsTarget(random);
  const streakTarget = pickStreakTarget(random);
  const selectedMove = pickMove(random);

  return {
    id: dateKey,
    dateKey,
    seed,
    currentWinStreak: 0,
    missions: [
      createMission({
        dateKey,
        index: 0,
        type: "round_wins",
        target: roundTarget,
      }),
      createMission({
        dateKey,
        index: 1,
        type: "win_streak",
        target: streakTarget,
      }),
      createMission({
        dateKey,
        index: 2,
        type: "move_wins",
        target: 2,
        meta: {
          move: selectedMove,
        },
      }),
    ],
  };
}
