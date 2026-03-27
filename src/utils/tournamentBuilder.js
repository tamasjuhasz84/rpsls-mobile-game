import { generateOpponentName } from "@/utils/opponentNameGenerator";
import { getAiProfileForOpponent } from "@/utils/aiProfiles";

export function buildTournament(size = 4) {
  const safeSize = Number.isInteger(size) && size > 0 ? size : 4;

  return Array.from({ length: safeSize }, (_, index) => {
    const aiProfile = getAiProfileForOpponent(index, safeSize);

    return {
      id: index + 1,
      name: generateOpponentName(),
      status: index === 0 ? "current" : "pending",
      aiProfile,
    };
  });
}
