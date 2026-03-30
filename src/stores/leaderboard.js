import { defineStore } from "pinia";
import { migrateLeaderboardState, saveLeaderboardState } from "@/utils/storage";

const MAX_LEADERBOARD_ENTRIES = 10;

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(Math.floor(parsed), 0);
}

function createDateKey(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date();
  const month = String(safeDate.getMonth() + 1).padStart(2, "0");
  const day = String(safeDate.getDate()).padStart(2, "0");
  return [safeDate.getFullYear(), month, day].join("-");
}

function normalizeEntries(entries = []) {
  return Array.isArray(entries)
    ? entries
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          ...entry,
          score: safeNumber(entry.score, 0),
          opponentsDefeated: safeNumber(entry.opponentsDefeated, 0),
          createdAt: safeNumber(entry.createdAt, Date.now()),
        }))
    : [];
}

function sortEntries(entries = []) {
  return [...entries].sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.createdAt - right.createdAt;
  });
}

function trimEntries(entries = []) {
  return sortEntries(entries).slice(0, MAX_LEADERBOARD_ENTRIES);
}

function computeRunScore(payload = {}) {
  if (payload.mode === "survival") {
    return safeNumber(payload.survivalScore, 0);
  }

  const opponents = safeNumber(payload.opponentsDefeated, 0);
  const playerScore = safeNumber(payload.playerScore, 0);
  const aiScore = safeNumber(payload.aiScore, 0);
  const won = Boolean(payload.won);
  const bo5Bonus = payload.mode === "bo5" ? 30 : 0;
  const dailyBonus = payload.sessionType === "daily" ? 25 : 0;

  return (
    opponents * 100 +
    (won ? 80 : 20) +
    Math.max(playerScore - aiScore, 0) * 15 +
    bo5Bonus +
    dailyBonus
  );
}

export const useLeaderboardStore = defineStore("leaderboard", {
  state: () => ({
    isLoaded: false,
    dailyDateKey: "",
    dailyEntries: [],
    allTimeEntries: [],
  }),

  getters: {
    hasDailyEntries: (state) => state.dailyEntries.length > 0,
    hasAllTimeEntries: (state) => state.allTimeEntries.length > 0,
  },

  actions: {
    persist() {
      if (!this.isLoaded) return;

      saveLeaderboardState({
        version: 1,
        allTimeEntries: this.allTimeEntries,
        daily: {
          dateKey: this.dailyDateKey,
          entries: this.dailyEntries,
        },
      });
    },

    hydrateToday(date = new Date()) {
      const dateKey = createDateKey(date);
      const migrated = migrateLeaderboardState(date);
      const sourceAllTime = normalizeEntries(migrated?.allTimeEntries || []);

      const sourceDaily =
        migrated?.daily?.dateKey === dateKey
          ? normalizeEntries(migrated?.daily?.entries || [])
          : [];

      this.isLoaded = true;
      this.dailyDateKey = dateKey;
      this.allTimeEntries = trimEntries(sourceAllTime);
      this.dailyEntries = trimEntries(sourceDaily);

      this.persist();
    },

    recordRun(payload = {}) {
      if (!this.isLoaded) {
        this.hydrateToday(new Date());
      }

      const entry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        playerName: String(payload.playerName || "Player").slice(0, 20),
        mode: String(payload.mode || "bo3"),
        sessionType: String(payload.sessionType || "tournament"),
        result: payload.won ? "won" : "lost",
        score: computeRunScore(payload),
        opponentsDefeated: safeNumber(payload.opponentsDefeated, 0),
        createdAt: Date.now(),
        dateKey: this.dailyDateKey,
      };

      this.dailyEntries = trimEntries([...this.dailyEntries, entry]);
      this.allTimeEntries = trimEntries([...this.allTimeEntries, entry]);
      this.persist();

      return entry;
    },
  },
});
