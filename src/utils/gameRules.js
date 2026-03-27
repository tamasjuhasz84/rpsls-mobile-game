import { getMoveAsset } from "@/utils/moveAssets";
export const MOVES = ["rock", "paper", "scissors", "lizard", "spock"];

export const WIN_RULES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["scissors", "rock"],
};

export const MOVE_LABELS = {
  hu: {
    rock: "Kő",
    paper: "Papír",
    scissors: "Olló",
    lizard: "Gyík",
    spock: "Spock",
  },
  en: {
    rock: "Rock",
    paper: "Paper",
    scissors: "Scissors",
    lizard: "Lizard",
    spock: "Spock",
  },
};

export const MOVE_ICONS = {
  rock: "rock",
  paper: "paper",
  scissors: "scissors",
  lizard: "lizard",
  spock: "spock",
};

export const COUNTDOWN_MOVE_MAP = {
  5: "rock",
  4: "paper",
  3: "scissors",
  2: "lizard",
  1: "spock",
};

export const EXPLANATION_KEYS = {
  rock_scissors: "rule.rock_scissors",
  rock_lizard: "rule.rock_lizard",
  paper_rock: "rule.paper_rock",
  paper_spock: "rule.paper_spock",
  scissors_paper: "rule.scissors_paper",
  scissors_lizard: "rule.scissors_lizard",
  lizard_paper: "rule.lizard_paper",
  lizard_spock: "rule.lizard_spock",
  spock_scissors: "rule.spock_scissors",
  spock_rock: "rule.spock_rock",
};

export function isValidMove(move) {
  return MOVES.includes(move);
}

export function getMoveLabel(move, locale = "hu") {
  if (!isValidMove(move)) return "";

  const normalizedLocale = locale === "en" ? "en" : "hu";
  return MOVE_LABELS[normalizedLocale][move] || "";
}

export function getMoveIcon(move) {
  if (!isValidMove(move)) return "";
  return MOVE_ICONS[move] || "";
}

export function getCountdownMove(countdownValue) {
  return COUNTDOWN_MOVE_MAP[countdownValue] || null;
}

export function getCountdownLabel(countdownValue, locale = "hu") {
  const move = getCountdownMove(countdownValue);
  if (!move) return "";

  return getMoveLabel(move, locale);
}

export function isDraw(playerMove, aiMove) {
  if (!isValidMove(playerMove) || !isValidMove(aiMove)) return false;
  return playerMove === aiMove;
}

export function doesMoveBeat(moveA, moveB) {
  if (!isValidMove(moveA) || !isValidMove(moveB)) return false;
  return WIN_RULES[moveA].includes(moveB);
}

export function getWinner(playerMove, aiMove) {
  if (!isValidMove(playerMove) || !isValidMove(aiMove)) {
    return null;
  }

  if (isDraw(playerMove, aiMove)) {
    return "draw";
  }

  if (doesMoveBeat(playerMove, aiMove)) {
    return "player";
  }

  return "ai";
}

export function getExplanationKey(playerMove, aiMove) {
  if (!isValidMove(playerMove) || !isValidMove(aiMove)) {
    return "";
  }

  if (isDraw(playerMove, aiMove)) {
    return "rule.draw";
  }

  if (doesMoveBeat(playerMove, aiMove)) {
    return EXPLANATION_KEYS[`${playerMove}_${aiMove}`] || "";
  }

  return EXPLANATION_KEYS[`${aiMove}_${playerMove}`] || "";
}

export function getMoveOptions(locale = "hu") {
  return MOVES.map((move) => ({
    value: move,
    label: getMoveLabel(move, locale),
    icon: getMoveIcon(move),
    asset: getMoveAsset(move),
  }));
}

export function getRulePairs() {
  return [
    { winner: "rock", loser: "scissors", key: "rule.rock_scissors" },
    { winner: "rock", loser: "lizard", key: "rule.rock_lizard" },
    { winner: "paper", loser: "rock", key: "rule.paper_rock" },
    { winner: "paper", loser: "spock", key: "rule.paper_spock" },
    { winner: "scissors", loser: "paper", key: "rule.scissors_paper" },
    { winner: "scissors", loser: "lizard", key: "rule.scissors_lizard" },
    { winner: "lizard", loser: "paper", key: "rule.lizard_paper" },
    { winner: "lizard", loser: "spock", key: "rule.lizard_spock" },
    { winner: "spock", loser: "scissors", key: "rule.spock_scissors" },
    { winner: "spock", loser: "rock", key: "rule.spock_rock" },
  ];
}
