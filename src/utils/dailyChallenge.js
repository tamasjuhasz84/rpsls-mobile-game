import {
  getAiProfileForOpponent,
  getOpponentArchetypeForSlot,
} from "./aiProfiles.js";
import { generateSeededOpponentName } from "./opponentNameGenerator.js";

function pad(value) {
  return String(value).padStart(2, "0");
}

export function getDailyChallengeDateKey(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date();
  return [
    safeDate.getFullYear(),
    pad(safeDate.getMonth() + 1),
    pad(safeDate.getDate()),
  ].join("-");
}

export function hashStringToSeed(value) {
  const text = String(value || "daily");
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = (Number(seed) || 1) >>> 0;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pickMode(random) {
  return random() > 0.62 ? "bo5" : "bo3";
}

function pickBracketSize(random) {
  const value = random();
  if (value > 0.8) return 5;
  if (value > 0.35) return 4;
  return 3;
}

function createBracket(seed, size) {
  return Array.from({ length: size }, (_, index) => {
    const nodeSeed = seed + index * 101;
    const archetype = getOpponentArchetypeForSlot(index, size);

    return {
      id: index + 1,
      name: generateSeededOpponentName(nodeSeed, {
        archetypeKey: archetype.key,
      }),
      status: index === 0 ? "current" : "pending",
      archetypeKey: archetype.key,
      strategyFlavorKey: archetype.strategyFlavorKey,
      opponentIntroKey: archetype.introKey,
      aiProfile: getAiProfileForOpponent(index, size),
    };
  });
}

export function buildDailyChallengeDefinition(date = new Date()) {
  const dateKey = getDailyChallengeDateKey(date);
  const seed = hashStringToSeed(dateKey);
  const random = createSeededRandom(seed);
  const mode = pickMode(random);
  const bracketSize = pickBracketSize(random);

  return {
    id: dateKey,
    dateKey,
    seed,
    mode,
    targetWins: mode === "bo5" ? 5 : 3,
    bracketSize,
    bracket: createBracket(seed, bracketSize),
  };
}
