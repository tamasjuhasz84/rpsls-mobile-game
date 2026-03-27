const GAME_STATE_KEY = "rpsls-game-state";
const UI_STATE_KEY = "rpsls-ui-state";
const LANG_KEY = "rpsls-lang";
const STATS_KEY = "rpsls-stats";

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
  return parseStoredJson(GAME_STATE_KEY, "game state");
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
