import { defineStore } from "pinia";
import {
  buildDailyChallengeDefinition,
  getDailyChallengeDateKey,
} from "@/utils/dailyChallenge";
import {
  loadDailyChallengeState,
  saveDailyChallengeState,
} from "@/utils/storage";

function createDefaultProgress(dateKey) {
  return {
    dateKey,
    status: "idle",
    result: "",
    completed: false,
    claimed: false,
    startedAt: 0,
    lastPlayedAt: 0,
    completedAt: 0,
    claimedAt: 0,
  };
}

function normalizeProgress(progress, fallbackProgress) {
  const hasCompletedFlag =
    progress && Object.prototype.hasOwnProperty.call(progress, "completed");
  const hasClaimedFlag =
    progress && Object.prototype.hasOwnProperty.call(progress, "claimed");
  const merged = {
    ...fallbackProgress,
    ...(progress || {}),
  };

  if (!hasCompletedFlag) {
    merged.completed = merged.status === "won" || merged.status === "lost";
  }

  if (!hasClaimedFlag) {
    merged.claimed = false;
  }

  return merged;
}

export const useDailyChallengeStore = defineStore("dailyChallenge", {
  state: () => ({
    challenge: null,
    progress: null,
  }),

  getters: {
    challengeId: (state) => state.challenge?.id || "",
    isLoaded: (state) => Boolean(state.challenge && state.progress),
    isCompletedToday: (state) => Boolean(state.progress?.completed),
    isClaimedToday: (state) => Boolean(state.progress?.claimed),
    isInProgressToday: (state) => state.progress?.status === "in_progress",
    hasWonToday: (state) => state.progress?.status === "won",
    hasLostToday: (state) => state.progress?.status === "lost",
  },

  actions: {
    persist() {
      if (!this.progress) return;
      saveDailyChallengeState(this.progress);
    },

    hydrateToday(date = new Date()) {
      const challenge = buildDailyChallengeDefinition(date);
      const fallbackProgress = createDefaultProgress(challenge.dateKey);
      const saved = loadDailyChallengeState();

      this.challenge = challenge;
      this.progress =
        saved?.dateKey === challenge.dateKey
          ? normalizeProgress(saved, fallbackProgress)
          : fallbackProgress;

      this.persist();
      return challenge;
    },

    startToday(date = new Date()) {
      if (!this.isLoaded) {
        this.hydrateToday(date);
      }

      if (this.isCompletedToday) {
        return this.challenge;
      }

      const now = Date.now();
      this.progress.status = "in_progress";
      this.progress.startedAt = this.progress.startedAt || now;
      this.progress.lastPlayedAt = now;
      this.persist();

      return this.challenge;
    },

    resumeToday(date = new Date()) {
      const challenge = this.hydrateToday(date);

      if (this.progress.status === "in_progress") {
        this.progress.lastPlayedAt = Date.now();
        this.persist();
      }

      return challenge;
    },

    markCompleted(result) {
      if (!this.challenge || !this.progress) return;
      if (result !== "won" && result !== "lost") return;

      const now = Date.now();
      this.progress.status = result;
      this.progress.result = result;
      this.progress.completed = true;
      this.progress.lastPlayedAt = now;
      this.progress.completedAt = now;
      this.progress.startedAt = this.progress.startedAt || now;
      this.persist();
    },

    markFinished(result) {
      this.markCompleted(result);
    },

    claimReward() {
      if (!this.challenge || !this.progress) return false;
      if (!this.progress.completed || this.progress.claimed) return false;

      this.progress.claimed = true;
      this.progress.claimedAt = Date.now();
      this.persist();
      return true;
    },

    isSavedChallengeForToday(payload) {
      if (!payload || typeof payload !== "object") return false;
      if (payload.sessionType !== "daily") return false;
      return payload.dailyChallengeId === getDailyChallengeDateKey(new Date());
    },
  },
});
