import { buildTournament } from "../src/utils/tournamentBuilder.js";
import { getAiMoveByProfile } from "../src/utils/aiEngine.js";
import { MOVES, getWinner } from "../src/utils/gameRules.js";

const MATCH_TARGET = 3;
const SAMPLES_PER_OPPONENT = 300;

function randomMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function simulateMatch(profile) {
  const playerHistory = [];
  const aiHistory = [];
  let playerScore = 0;
  let aiScore = 0;
  let roundNumber = 1;

  while (playerScore < MATCH_TARGET && aiScore < MATCH_TARGET) {
    const playerMove = randomMove();
    const aiMove = getAiMoveByProfile({
      profile,
      playerHistory,
      aiHistory,
      roundNumber,
      score: {
        player: playerScore,
        ai: aiScore,
      },
    });

    const result = getWinner(playerMove, aiMove);
    if (result === "player") playerScore += 1;
    if (result === "ai") aiScore += 1;

    playerHistory.push(playerMove);
    aiHistory.push(aiMove);
    roundNumber += 1;
  }

  return playerScore > aiScore ? "player" : "ai";
}

function run() {
  const bracket = buildTournament(8);

  const rows = bracket.map((node, index) => {
    let playerWins = 0;

    for (let sample = 0; sample < SAMPLES_PER_OPPONENT; sample += 1) {
      if (simulateMatch(node.aiProfile) === "player") {
        playerWins += 1;
      }
    }

    const playerWinrate = Number(
      ((playerWins / SAMPLES_PER_OPPONENT) * 100).toFixed(1),
    );

    return {
      opponent: index + 1,
      strategy: node.aiProfile.strategyType,
      tier: node.aiProfile.difficultyTier,
      adaptation: Number(node.aiProfile.adaptationChance.toFixed(3)),
      chaos: Number(node.aiProfile.chaosFactor.toFixed(3)),
      playerWinrate,
    };
  });

  console.table(rows);
}

run();
