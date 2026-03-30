const GAME_STATE_KEY = "rpsls-game-state";
const UI_STATE_KEY = "rpsls-ui-state";
const LANG_KEY = "rpsls-lang";
const STATS_KEY = "rpsls-stats";
const LEADERBOARD_STATE_KEY = "rpsls-leaderboard-state";
const DAILY_CHALLENGE_STATE_KEY = "rpsls-daily-challenge-state";
const MISSION_STATE_KEY = "rpsls-mission-state";
const ONBOARDING_KEY = "rpsls-onboarding";

function parseStoredJson(key, label) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to load ${label}:`, error);
    safeRemoveItem(key);
    return null;
  }
}

export function saveGameState(payload) {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

export function loadGameState() {
  const parsed = parseStoredJson(GAME_STATE_KEY, "game state");
  if (!parsed) return null;

  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    console.error("Invalid game state payload shape. Clearing saved state.");
    safeRemoveItem(GAME_STATE_KEY);
    return null;
  }

  return parsed;
}

export function clearGameState() {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error("Failed to clear game state:", error);
  }
}

export function saveUiState(payload) {
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save UI state:", error);
  }
}

export function loadUiState() {
  return parseStoredJson(UI_STATE_KEY, "UI state");
}

export function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read localStorage key: ${key}`, error);
    return null;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to write localStorage key: ${key}`, error);
  }
}

export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key: ${key}`, error);
  }
}

export function saveLanguage(locale) {
  safeSetItem(LANG_KEY, locale);
}

export function loadLanguage() {
  return safeGetItem(LANG_KEY);
}

export function saveStats(payload) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
}

export function loadStats() {
  return parseStoredJson(STATS_KEY, "stats");
}

export function clearStats() {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.error("Failed to clear stats:", error);
  }
}

function getDateKey(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date();
  const month = String(safeDate.getMonth() + 1).padStart(2, "0");
  const day = String(safeDate.getDate()).padStart(2, "0");
  return [safeDate.getFullYear(), month, day].join("-");
}

function buildDefaultLeaderboardState(date = new Date()) {
  return {
    version: 1,
    allTimeEntries: [],
    daily: {
      dateKey: getDateKey(date),
      entries: [],
    },
    migration: {
      migratedFromStats: false,
      migratedAt: Date.now(),
    },
  };
}

export function saveLeaderboardState(payload) {
  try {
    localStorage.setItem(LEADERBOARD_STATE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save leaderboard state:", error);
  }
}

export function loadLeaderboardState() {
  return parseStoredJson(LEADERBOARD_STATE_KEY, "leaderboard state");
}

export function clearLeaderboardState() {
  try {
    localStorage.removeItem(LEADERBOARD_STATE_KEY);
  } catch (error) {
    console.error("Failed to clear leaderboard state:", error);
  }
}

export function migrateLeaderboardState(date = new Date()) {
  const existing = loadLeaderboardState();
  if (existing && typeof existing === "object") {
    if (existing.version >= 1) {
      return existing;
    }

    const upgraded = {
      ...buildDefaultLeaderboardState(date),
      ...existing,
      version: 1,
      daily:
        existing.daily && typeof existing.daily === "object"
          ? {
              dateKey:
                typeof existing.daily.dateKey === "string"
                  ? existing.daily.dateKey
                  : getDateKey(date),
              entries: Array.isArray(existing.daily.entries)
                ? existing.daily.entries
                : [],
            }
          : {
              dateKey: getDateKey(date),
              entries: [],
            },
    };

    saveLeaderboardState(upgraded);
    return upgraded;
  }

  const baseline = buildDefaultLeaderboardState(date);
  const stats = loadStats();

  if (
    !stats ||
    !Number.isFinite(Number(stats.totalGames)) ||
    stats.totalGames <= 0
  ) {
    saveLeaderboardState(baseline);
    return baseline;
  }

  const legacyScore =
    Math.max(Number(stats.wins) || 0, 0) * 25 +
    Math.max(Number(stats.bestWinStreak) || 0, 0) * 15 +
    Math.max(Number(stats.totalGames) || 0, 0);

  const migrated = {
    ...baseline,
    allTimeEntries: [
      {
        id: `legacy-${Date.now()}`,
        playerName: "Player",
        mode: "legacy",
        sessionType: "legacy",
        result: "legacy",
        score: Math.round(legacyScore),
        opponentsDefeated: Math.max(Number(stats.wins) || 0, 0),
        createdAt: Date.now(),
        dateKey: baseline.daily.dateKey,
        legacy: true,
      },
    ],
    migration: {
      migratedFromStats: true,
      migratedAt: Date.now(),
    },
  };

  saveLeaderboardState(migrated);
  return migrated;
}

export function saveDailyChallengeState(payload) {
  try {
    localStorage.setItem(DAILY_CHALLENGE_STATE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save daily challenge state:", error);
  }
}

export function loadDailyChallengeState() {
  return parseStoredJson(DAILY_CHALLENGE_STATE_KEY, "daily challenge state");
}

export function clearDailyChallengeState() {
  try {
    localStorage.removeItem(DAILY_CHALLENGE_STATE_KEY);
  } catch (error) {
    console.error("Failed to clear daily challenge state:", error);
  }
}

export function saveMissionState(payload) {
  try {
    localStorage.setItem(MISSION_STATE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save mission state:", error);
  }
}

export function loadMissionState() {
  return parseStoredJson(MISSION_STATE_KEY, "mission state");
}

export function clearMissionState() {
  try {
    localStorage.removeItem(MISSION_STATE_KEY);
  } catch (error) {
    console.error("Failed to clear mission state:", error);
  }
}

export function saveOnboardingState(payload) {
  try {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save onboarding state:", error);
  }
}

export function loadOnboardingState() {
  return parseStoredJson(ONBOARDING_KEY, "onboarding state");
}

export function clearOnboardingState() {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error("Failed to clear onboarding state:", error);
  }
}
