import { MOVES } from "@/utils/gameRules";

const BASE_PROFILE = {
  strategyType: "random",
  favoriteMoves: [],
  adaptationChance: 0,
  chaosFactor: 0,
  difficultyTier: 1,
};

export const AI_PROFILES = {
  random: {
    ...BASE_PROFILE,
    strategyType: "random",
    difficultyTier: 1,
  },
  favorite: {
    ...BASE_PROFILE,
    strategyType: "favorite",
    favoriteMoves: ["rock", "scissors"],
    adaptationChance: 0.08,
    chaosFactor: 0.05,
    difficultyTier: 2,
  },
  counterBiased: {
    ...BASE_PROFILE,
    strategyType: "counter-biased",
    adaptationChance: 0.32,
    chaosFactor: 0.1,
    difficultyTier: 3,
  },
  streakPunisher: {
    ...BASE_PROFILE,
    strategyType: "streak-punisher",
    adaptationChance: 0.38,
    chaosFactor: 0.08,
    difficultyTier: 4,
  },
  chaotic: {
    ...BASE_PROFILE,
    strategyType: "chaotic",
    adaptationChance: 0.22,
    chaosFactor: 0.6,
    difficultyTier: 3,
  },
  boss: {
    ...BASE_PROFILE,
    strategyType: "boss",
    favoriteMoves: ["spock", "paper"],
    adaptationChance: 0.52,
    chaosFactor: 0.2,
    difficultyTier: 5,
  },
};

function clampRound(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(Math.round(parsed), 0);
}

function pickFavoriteMoves(opponentIndex, count = 1) {
  const safeCount = Math.max(1, Math.min(count, MOVES.length));
  const start = clampRound(opponentIndex, 0) % MOVES.length;
  const favorites = [];

  for (let offset = 0; offset < safeCount; offset += 1) {
    favorites.push(MOVES[(start + offset * 2) % MOVES.length]);
  }

  return Array.from(new Set(favorites));
}

function createProfile(base, overrides = {}) {
  const favoriteMoves = Array.isArray(overrides.favoriteMoves)
    ? overrides.favoriteMoves
    : base.favoriteMoves;

  return {
    ...base,
    ...overrides,
    favoriteMoves,
  };
}

export function getAiProfileForOpponent(opponentIndex, totalOpponents) {
  const safeTotal = Math.max(clampRound(totalOpponents, 4), 1);
  const safeIndex = Math.min(
    Math.max(clampRound(opponentIndex, 0), 0),
    safeTotal - 1,
  );

  if (safeIndex === safeTotal - 1) {
    return createProfile(AI_PROFILES.boss, {
      favoriteMoves: pickFavoriteMoves(safeIndex + 1, 2),
      adaptationChance: 0.5 + Math.min(safeTotal, 8) * 0.01,
      chaosFactor: 0.18,
    });
  }

  const progress = safeTotal > 1 ? safeIndex / (safeTotal - 1) : 0;

  if (progress < 0.2) {
    return createProfile(AI_PROFILES.random, {
      difficultyTier: 1,
    });
  }

  if (progress < 0.45) {
    return createProfile(AI_PROFILES.favorite, {
      favoriteMoves: pickFavoriteMoves(safeIndex, 1),
      adaptationChance: 0.1 + progress * 0.08,
      difficultyTier: 2,
    });
  }

  if (progress < 0.7) {
    return createProfile(AI_PROFILES.counterBiased, {
      favoriteMoves: pickFavoriteMoves(safeIndex, 1),
      adaptationChance: 0.26 + progress * 0.12,
      difficultyTier: 3,
    });
  }

  if (progress < 0.9) {
    return createProfile(AI_PROFILES.streakPunisher, {
      favoriteMoves: pickFavoriteMoves(safeIndex, 2),
      adaptationChance: 0.33 + progress * 0.1,
      difficultyTier: 4,
    });
  }

  return createProfile(AI_PROFILES.chaotic, {
    favoriteMoves: pickFavoriteMoves(safeIndex, 2),
    adaptationChance: 0.24,
    chaosFactor: 0.5,
    difficultyTier: 4,
  });
}

export function normalizeAiProfile(profile) {
  const source =
    profile && typeof profile === "object" ? profile : AI_PROFILES.random;
  const favoriteMoves = Array.isArray(source.favoriteMoves)
    ? source.favoriteMoves.filter((move) => MOVES.includes(move))
    : [];

  return {
    strategyType:
      typeof source.strategyType === "string" ? source.strategyType : "random",
    favoriteMoves,
    adaptationChance: Number.isFinite(Number(source.adaptationChance))
      ? Math.max(0, Math.min(Number(source.adaptationChance), 0.9))
      : 0,
    chaosFactor: Number.isFinite(Number(source.chaosFactor))
      ? Math.max(0, Math.min(Number(source.chaosFactor), 1))
      : 0,
    difficultyTier: Number.isFinite(Number(source.difficultyTier))
      ? Math.max(1, Math.min(Math.round(Number(source.difficultyTier)), 5))
      : 1,
  };
}
