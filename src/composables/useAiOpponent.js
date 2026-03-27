import { getAiMoveByProfile } from "@/utils/aiEngine";

export function useAiOpponent() {
  let roundHistory = [];

  function getAiMove(context = {}) {
    const playerHistory = roundHistory.map((entry) => entry.playerMove);
    const aiHistory = roundHistory.map((entry) => entry.aiMove);

    return getAiMoveByProfile({
      ...context,
      playerHistory,
      aiHistory,
    });
  }

  function registerRound({ playerMove, aiMove, result } = {}) {
    if (!playerMove || !aiMove) return;

    roundHistory.push({
      playerMove,
      aiMove,
      result: result || null,
    });

    if (roundHistory.length > 15) {
      roundHistory = roundHistory.slice(-15);
    }
  }

  function resetHistory() {
    roundHistory = [];
  }

  return {
    getAiMove,
    registerRound,
    resetHistory,
  };
}
