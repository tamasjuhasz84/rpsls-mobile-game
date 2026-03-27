import { defineStore } from "pinia";
import { saveStats, clearStats } from "@/utils/storage";

const VALID_RESULTS = ["player", "ai", "draw"];

export const useStatsStore = defineStore("stats", {
  state: () => ({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    currentStreak: 0,
    bestWinStreak: 0,
    lastResult: null,
  }),

  getters: {
    winrate: (state) => {
      if (state.totalGames === 0) return 0;
      return Math.round((state.wins / state.totalGames) * 100);
    },

    hasGames: (state) => state.totalGames > 0,
  },

  actions: {
    updateStats(result) {
      if (!VALID_RESULTS.includes(result)) return;

      this.totalGames += 1;
      this.lastResult = result;

      if (result === "player") {
        this.wins += 1;
        this.currentStreak += 1;
        if (this.currentStreak > this.bestWinStreak) {
          this.bestWinStreak = this.currentStreak;
        }
      } else if (result === "ai") {
        this.losses += 1;
        this.currentStreak = 0;
      } else {
        this.draws += 1;
      }

      saveStats({
        totalGames: this.totalGames,
        wins: this.wins,
        losses: this.losses,
        draws: this.draws,
        currentStreak: this.currentStreak,
        bestWinStreak: this.bestWinStreak,
        lastResult: this.lastResult,
      });
    },

    resetStats() {
      this.totalGames = 0;
      this.wins = 0;
      this.losses = 0;
      this.draws = 0;
      this.currentStreak = 0;
      this.bestWinStreak = 0;
      this.lastResult = null;
      clearStats();
    },

    hydrateFromStorage(payload = {}) {
      this.wins = this._safeNonNeg(payload.wins);
      this.losses = this._safeNonNeg(payload.losses);
      this.draws = this._safeNonNeg(payload.draws);

      const loadedTotalGames = this._safeNonNeg(payload.totalGames);
      const derivedTotalGames = this.wins + this.losses + this.draws;
      this.totalGames = Math.max(loadedTotalGames, derivedTotalGames);

      this.currentStreak = this._safeNonNeg(payload.currentStreak);
      this.bestWinStreak = this._safeNonNeg(payload.bestWinStreak);
      this.bestWinStreak = Math.max(this.bestWinStreak, this.currentStreak);

      this.lastResult = VALID_RESULTS.includes(payload.lastResult)
        ? payload.lastResult
        : null;
    },

    _safeNonNeg(value, fallback = 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0
        ? Math.floor(parsed)
        : fallback;
    },
  },
});
