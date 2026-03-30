import { MOVES } from "./gameRules.js";

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

export const OPPONENT_ARCHETYPES = {
  rookieBluffer: {
    key: "rookieBluffer",
    strategyType: "random",
    personalityKey: "opponent.archetype.rookieBluffer.personality",
    strategyFlavorKey: "opponent.archetype.rookieBluffer.flavor",
    introKeys: [
      "opponent.intro.rookieBluffer.0",
      "opponent.intro.rookieBluffer.1",
      "opponent.intro.rookieBluffer.2",
    ],
  },
  patternHunter: {
    key: "patternHunter",
    strategyType: "favorite",
    personalityKey: "opponent.archetype.patternHunter.personality",
    strategyFlavorKey: "opponent.archetype.patternHunter.flavor",
    introKeys: [
      "opponent.intro.patternHunter.0",
      "opponent.intro.patternHunter.1",
      "opponent.intro.patternHunter.2",
    ],
  },
  signalReader: {
    key: "signalReader",
    strategyType: "counter-biased",
    personalityKey: "opponent.archetype.signalReader.personality",
    strategyFlavorKey: "opponent.archetype.signalReader.flavor",
    introKeys: [
      "opponent.intro.signalReader.0",
      "opponent.intro.signalReader.1",
      "opponent.intro.signalReader.2",
    ],
  },
  momentumBreaker: {
    key: "momentumBreaker",
    strategyType: "streak-punisher",
    personalityKey: "opponent.archetype.momentumBreaker.personality",
    strategyFlavorKey: "opponent.archetype.momentumBreaker.flavor",
    introKeys: [
      "opponent.intro.momentumBreaker.0",
      "opponent.intro.momentumBreaker.1",
      "opponent.intro.momentumBreaker.2",
    ],
  },
  wildCard: {
    key: "wildCard",
    strategyType: "chaotic",
    personalityKey: "opponent.archetype.wildCard.personality",
    strategyFlavorKey: "opponent.archetype.wildCard.flavor",
    introKeys: [
      "opponent.intro.wildCard.0",
      "opponent.intro.wildCard.1",
      "opponent.intro.wildCard.2",
    ],
  },
  grandmaster: {
    key: "grandmaster",
    strategyType: "boss",
    personalityKey: "opponent.archetype.grandmaster.personality",
    strategyFlavorKey: "opponent.archetype.grandmaster.flavor",
    introKeys: [
      "opponent.intro.grandmaster.0",
      "opponent.intro.grandmaster.1",
      "opponent.intro.grandmaster.2",
    ],
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

function getArchetypeByProgress(progress, isFinalOpponent) {
  if (isFinalOpponent) return OPPONENT_ARCHETYPES.grandmaster;
  if (progress < 0.28) return OPPONENT_ARCHETYPES.rookieBluffer;
  if (progress < 0.5) return OPPONENT_ARCHETYPES.patternHunter;
  if (progress < 0.74) return OPPONENT_ARCHETYPES.signalReader;
  if (progress < 0.9) return OPPONENT_ARCHETYPES.momentumBreaker;
  return OPPONENT_ARCHETYPES.wildCard;
}

export function getOpponentArchetypeForSlot(opponentIndex, totalOpponents) {
  const safeTotal = Math.max(clampRound(totalOpponents, 4), 1);
  const safeIndex = Math.min(
    Math.max(clampRound(opponentIndex, 0), 0),
    safeTotal - 1,
  );
  const isFinalOpponent = safeIndex === safeTotal - 1;
  const progress = safeTotal > 1 ? safeIndex / (safeTotal - 1) : 0;
  const archetype = getArchetypeByProgress(progress, isFinalOpponent);
  const introKeys = Array.isArray(archetype.introKeys)
    ? archetype.introKeys
    : [];
  const introKey = introKeys.length
    ? introKeys[safeIndex % introKeys.length]
    : "";

  return {
    ...archetype,
    introKey,
  };
}

export function getAiProfileForOpponent(opponentIndex, totalOpponents) {
  const safeTotal = Math.max(clampRound(totalOpponents, 4), 1);
  const safeIndex = Math.min(
    Math.max(clampRound(opponentIndex, 0), 0),
    safeTotal - 1,
  );
  const archetype = getOpponentArchetypeForSlot(safeIndex, safeTotal);

  if (safeIndex === safeTotal - 1) {
    return createProfile(AI_PROFILES.boss, {
      favoriteMoves: pickFavoriteMoves(safeIndex + 1, 2),
      adaptationChance: 0.46 + Math.min(safeTotal, 8) * 0.01,
      chaosFactor: 0.18,
      archetypeKey: archetype.key,
      strategyFlavorKey: archetype.strategyFlavorKey,
    });
  }

  const progress = safeTotal > 1 ? safeIndex / (safeTotal - 1) : 0;

  // Day 13 balancing: soften opening opponents so early rounds remain welcoming.
  if (progress < 0.28) {
    return createProfile(AI_PROFILES.random, {
      adaptationChance: 0,
      chaosFactor: 0.03,
      difficultyTier: 1,
      archetypeKey: archetype.key,
      strategyFlavorKey: archetype.strategyFlavorKey,
    });
  }

  if (progress < 0.5) {
    return createProfile(AI_PROFILES.favorite, {
      favoriteMoves: pickFavoriteMoves(safeIndex, 1),
      adaptationChance: 0.06 + progress * 0.06,
      chaosFactor: 0.04,
      difficultyTier: 2,
      archetypeKey: archetype.key,
      strategyFlavorKey: archetype.strategyFlavorKey,
    });
  }

  if (progress < 0.74) {
    return createProfile(AI_PROFILES.counterBiased, {
      favoriteMoves: pickFavoriteMoves(safeIndex, 1),
      adaptationChance: 0.22 + progress * 0.11,
      difficultyTier: 3,
      archetypeKey: archetype.key,
      strategyFlavorKey: archetype.strategyFlavorKey,
    });
  }

  if (progress < 0.9) {
    return createProfile(AI_PROFILES.streakPunisher, {
      favoriteMoves: pickFavoriteMoves(safeIndex, 2),
      adaptationChance: 0.33 + progress * 0.1,
      difficultyTier: 4,
      archetypeKey: archetype.key,
      strategyFlavorKey: archetype.strategyFlavorKey,
    });
  }

  return createProfile(AI_PROFILES.chaotic, {
    favoriteMoves: pickFavoriteMoves(safeIndex, 2),
    adaptationChance: 0.24,
    chaosFactor: 0.5,
    difficultyTier: 4,
    archetypeKey: archetype.key,
    strategyFlavorKey: archetype.strategyFlavorKey,
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
    archetypeKey:
      typeof source.archetypeKey === "string" ? source.archetypeKey : "",
    strategyFlavorKey:
      typeof source.strategyFlavorKey === "string"
        ? source.strategyFlavorKey
        : "",
  };
}
