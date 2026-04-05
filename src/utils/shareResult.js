function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(Math.floor(parsed), 0);
}

export function buildShareResultText(payload = {}) {
  const labels =
    payload.labels && typeof payload.labels === "object" ? payload.labels : {};

  const appTitle = String(payload.appTitle || "RPSLS");
  const modeLabel = String(payload.modeLabel || "Tournament");
  const resultLabel = String(payload.resultLabel || "Completed");
  const isSurvival = Boolean(payload.isSurvival);
  const playerScore = safeNumber(payload.playerScore, 0);
  const aiScore = safeNumber(payload.aiScore, 0);
  const survivalScore = safeNumber(payload.survivalScore, 0);
  const opponentsDefeated = safeNumber(payload.opponentsDefeated, 0);
  const winStreak = safeNumber(payload.winStreak, 0);

  const lines = [
    appTitle,
    `${labels.mode || "Mode"}: ${modeLabel}`,
    `${labels.result || "Result"}: ${resultLabel}`,
  ];

  if (isSurvival) {
    lines.push(`${labels.survivalScore || "Run score"}: ${survivalScore}`);
  } else {
    lines.push(
      `${labels.matchScore || "Match score"}: ${playerScore}-${aiScore}`
    );
  }

  lines.push(
    `${labels.opponents || "Opponents defeated"}: ${opponentsDefeated}`
  );

  if (winStreak > 1) {
    lines.push(`${labels.winStreak || "Win streak"}: ${winStreak}`);
  }

  lines.push(String(payload.hashTag || "#RPSLS"));
  return lines.join("\n");
}
