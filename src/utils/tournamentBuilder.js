import { generateOpponentName } from "./opponentNameGenerator.js";
import {
  getAiProfileForOpponent,
  getOpponentArchetypeForSlot,
} from "./aiProfiles.js";

function createOpponentNode(index, totalOpponents) {
  const archetype = getOpponentArchetypeForSlot(index, totalOpponents);
  const aiProfile = getAiProfileForOpponent(index, totalOpponents);

  return {
    id: index + 1,
    name: generateOpponentName({ archetypeKey: archetype.key }),
    status: index === 0 ? "current" : "pending",
    archetypeKey: archetype.key,
    strategyFlavorKey: archetype.strategyFlavorKey,
    opponentIntroKey: archetype.introKey,
    aiProfile,
  };
}

export function buildSurvivalOpponent(opponentIndex = 0) {
  const safeIndex = Math.max(0, Math.floor(Number(opponentIndex) || 0));
  // Endless mode has no final boss slot, so we keep one virtual future slot.
  const virtualTotal = safeIndex + 2;
  return createOpponentNode(safeIndex, virtualTotal);
}

export function buildTournament(size = 4) {
  const safeSize = Number.isInteger(size) && size > 0 ? size : 4;

  return Array.from({ length: safeSize }, (_, index) =>
    createOpponentNode(index, safeSize)
  );
}
