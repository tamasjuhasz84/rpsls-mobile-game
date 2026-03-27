import { MOVES, WIN_RULES } from "@/utils/gameRules";
import { normalizeAiProfile } from "@/utils/aiProfiles";

function getRandomMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function getCounterMoves(move) {
  if (!move || !MOVES.includes(move)) return [];

  return MOVES.filter((candidate) => WIN_RULES[candidate]?.includes(move));
}

function createBaseWeights() {
  return MOVES.reduce((weights, move) => {
    weights[move] = 1;
    return weights;
  }, {});
}

function applyFavoriteBias(weights, favoriteMoves, boost = 1.1) {
  if (!Array.isArray(favoriteMoves) || favoriteMoves.length === 0) return;

  favoriteMoves.forEach((move) => {
    if (!weights[move]) return;
    weights[move] += boost;
  });
}

function applyCounterBias(weights, targetMove, strength = 1.4) {
  const counters = getCounterMoves(targetMove);
  if (!counters.length) return;

  counters.forEach((move) => {
    weights[move] += strength;
  });
}

function getRecentStreak(history = []) {
  if (!history.length) {
    return { move: null, length: 0 };
  }

  const lastMove = history[history.length - 1];
  let length = 1;

  for (let index = history.length - 2; index >= 0; index -= 1) {
    if (history[index] !== lastMove) break;
    length += 1;
  }

  return {
    move: lastMove,
    length,
  };
}

function applyRepeatPenalty(weights, move, strength = 0.2) {
  if (!move || !weights[move]) return;

  const safeStrength = Math.max(0, Math.min(strength, 0.75));
  weights[move] = Math.max(0.2, weights[move] * (1 - safeStrength));
}

function applyChaos(weights, chaosFactor) {
  if (!chaosFactor) return;

  MOVES.forEach((move) => {
    const variation = (Math.random() * 2 - 1) * chaosFactor;
    const multiplier = 1 + variation;
    weights[move] = Math.max(0.15, weights[move] * multiplier);
  });
}

function pickWeightedMove(weights) {
  const pool = MOVES.map((move) => ({
    move,
    weight: Math.max(0.01, Number(weights[move]) || 0.01),
  }));

  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return getRandomMove();

  let target = Math.random() * totalWeight;

  for (let index = 0; index < pool.length; index += 1) {
    target -= pool[index].weight;
    if (target <= 0) return pool[index].move;
  }

  return pool[pool.length - 1].move;
}

export function getAiMoveByProfile(context = {}) {
  const profile = normalizeAiProfile(context.profile);
  const playerHistory = Array.isArray(context.playerHistory)
    ? context.playerHistory.filter((move) => MOVES.includes(move))
    : [];
  const aiHistory = Array.isArray(context.aiHistory)
    ? context.aiHistory.filter((move) => MOVES.includes(move))
    : [];
  const score =
    context.score && typeof context.score === "object" ? context.score : {};
  const roundNumber = Number.isFinite(Number(context.roundNumber))
    ? Math.max(1, Number(context.roundNumber))
    : 1;
  const playerScore = Number.isFinite(Number(score.player))
    ? Number(score.player)
    : 0;
  const aiScore = Number.isFinite(Number(score.ai)) ? Number(score.ai) : 0;

  if (profile.strategyType === "random") {
    return getRandomMove();
  }

  const weights = createBaseWeights();
  const lastPlayerMove = playerHistory[playerHistory.length - 1] || null;
  const aiStreak = getRecentStreak(aiHistory);
  const streak = getRecentStreak(playerHistory);

  applyFavoriteBias(
    weights,
    profile.favoriteMoves,
    1 + profile.difficultyTier * 0.2,
  );

  if (profile.strategyType === "favorite") {
    if (lastPlayerMove && Math.random() < profile.adaptationChance * 0.5) {
      applyCounterBias(weights, lastPlayerMove, 0.9);
    }
  }

  if (profile.strategyType === "counter-biased") {
    if (lastPlayerMove && Math.random() < profile.adaptationChance) {
      applyCounterBias(weights, lastPlayerMove, 1.35);
    }
  }

  if (profile.strategyType === "streak-punisher") {
    if (streak.length >= 2 && Math.random() < profile.adaptationChance + 0.12) {
      const streakStrength = Math.min(1.8, 1 + streak.length * 0.22);
      applyCounterBias(weights, streak.move, streakStrength);
    } else if (
      lastPlayerMove &&
      Math.random() < profile.adaptationChance * 0.6
    ) {
      applyCounterBias(weights, lastPlayerMove, 1.05);
    }
  }

  if (profile.strategyType === "chaotic") {
    if (lastPlayerMove && Math.random() < profile.adaptationChance * 0.75) {
      applyCounterBias(weights, lastPlayerMove, 1);
    }
    if (Math.random() < 0.3 && profile.favoriteMoves.length) {
      applyFavoriteBias(weights, profile.favoriteMoves, 1.2);
    }

    if (aiStreak.length >= 2) {
      applyRepeatPenalty(weights, aiStreak.move, 0.35);
    }
  }

  if (profile.strategyType === "boss") {
    if (lastPlayerMove && Math.random() < profile.adaptationChance) {
      applyCounterBias(weights, lastPlayerMove, 1.5);
    }

    if (streak.length >= 2) {
      const baseChance = 0.42 + Math.min(streak.length, 4) * 0.06;
      const pressureBonus = playerScore > aiScore ? 0.08 : 0;
      if (Math.random() < baseChance + pressureBonus) {
        applyCounterBias(weights, streak.move, 1.65);
      }
    }

    if (aiScore < playerScore && lastPlayerMove) {
      applyCounterBias(weights, lastPlayerMove, 0.85);
    }

    if (roundNumber >= 4 && lastPlayerMove) {
      const roundPressure = Math.min(0.22, (roundNumber - 3) * 0.04);
      if (Math.random() < roundPressure) {
        applyCounterBias(weights, lastPlayerMove, 0.75);
      }
    }

    if (aiStreak.length >= 2) {
      applyRepeatPenalty(weights, aiStreak.move, 0.25);
    }
  }

  applyChaos(weights, profile.chaosFactor);

  return pickWeightedMove(weights);
}
