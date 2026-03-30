import { defineStore } from "pinia";
import {
  buildTournament,
  buildSurvivalOpponent,
} from "@/utils/tournamentBuilder";
import { saveGameState, loadGameState, clearGameState } from "@/utils/storage";

export const useTournamentStore = defineStore("tournament", {
  state: () => ({
    mode: "bo3",
    targetWins: 3,
    sessionType: "tournament",
    dailyChallengeId: "",
    playerScore: 0,
    aiScore: 0,
    survivalScore: 0,
    survivalOpponentsDefeated: 0,
    survivalRoundWins: 0,
    survivalRoundDraws: 0,
    currentOpponent: null,
    bracket: [],
    currentRoundIndex: 0,
    matchFinished: false,
    tournamentFinished: false,
    tournamentLost: false,
    lastProcessedRoundResultKey: "",
  }),

  getters: {
    hasOpponent: (state) => !!state.currentOpponent,
    scoreText: (state) => `${state.playerScore} - ${state.aiScore}`,
    remainingPlayerWins: (state) =>
      Math.max(state.targetWins - state.playerScore, 0),
    remainingAiWins: (state) => Math.max(state.targetWins - state.aiScore, 0),
    isLastOpponent: (state) =>
      state.bracket.length > 0 &&
      state.currentRoundIndex >= state.bracket.length - 1,
    hasSavedProgress: (state) => state.bracket.length > 0,
    isSurvivalMode: (state) => state.mode === "survival",
  },

  actions: {
    normalizeNonNegativeNumber(value, fallback = 0) {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) return fallback;
      return parsed;
    },

    hasValidSavedTournament(payload) {
      if (!payload || typeof payload !== "object") return false;
      if (!Array.isArray(payload.bracket) || payload.bracket.length === 0) {
        return false;
      }

      const hasInvalidNode = payload.bracket.some((node) => {
        if (!node || typeof node !== "object") return true;

        const hasValidId = Number.isInteger(Number(node.id));
        const hasValidName =
          typeof node.name === "string" && node.name.length > 0;

        return !hasValidId || !hasValidName;
      });

      if (hasInvalidNode) return false;

      const index = Number(payload.currentRoundIndex);
      if (!Number.isInteger(index)) return false;
      if (index < 0 || index >= payload.bracket.length) return false;

      return true;
    },

    setMode(mode) {
      if (mode === "bo5") {
        this.mode = "bo5";
        this.targetWins = 5;
        return;
      }

      if (mode === "survival") {
        this.mode = "survival";
        this.targetWins = 3;
        return;
      }

      this.mode = "bo3";
      this.targetWins = 3;
    },

    setBracket(bracket = []) {
      this.bracket = bracket;
      this.currentRoundIndex = 0;
      this.currentOpponent = bracket[0] ?? null;
      this.playerScore = 0;
      this.aiScore = 0;
      this.survivalScore = 0;
      this.survivalOpponentsDefeated = 0;
      this.survivalRoundWins = 0;
      this.survivalRoundDraws = 0;
      this.matchFinished = false;
      this.tournamentFinished = false;
      this.tournamentLost = false;
      this.lastProcessedRoundResultKey = "";

      this.bracket.forEach((node, index) => {
        node.status = index === 0 ? "current" : "pending";
      });
    },

    hydrateFromStorage(payload = {}) {
      this.mode =
        payload.mode === "bo5"
          ? "bo5"
          : payload.mode === "survival"
            ? "survival"
            : "bo3";
      this.targetWins = this.mode === "bo5" ? 5 : 3;
      this.sessionType =
        payload.sessionType === "daily" ? "daily" : "tournament";
      this.dailyChallengeId =
        typeof payload.dailyChallengeId === "string"
          ? payload.dailyChallengeId
          : "";
      this.playerScore = this.normalizeNonNegativeNumber(
        payload.playerScore,
        0,
      );
      this.aiScore = this.normalizeNonNegativeNumber(payload.aiScore, 0);
      this.survivalScore = this.normalizeNonNegativeNumber(
        payload.survivalScore,
        0,
      );
      this.survivalOpponentsDefeated = this.normalizeNonNegativeNumber(
        payload.survivalOpponentsDefeated,
        0,
      );
      this.survivalRoundWins = this.normalizeNonNegativeNumber(
        payload.survivalRoundWins,
        0,
      );
      this.survivalRoundDraws = this.normalizeNonNegativeNumber(
        payload.survivalRoundDraws,
        0,
      );
      this.bracket = Array.isArray(payload.bracket) ? payload.bracket : [];
      this.currentRoundIndex = this.normalizeNonNegativeNumber(
        payload.currentRoundIndex,
        0,
      );
      if (this.currentRoundIndex >= this.bracket.length) {
        this.currentRoundIndex = 0;
      }
      this.matchFinished = Boolean(payload.matchFinished);
      this.tournamentFinished = Boolean(payload.tournamentFinished);
      this.tournamentLost = Boolean(payload.tournamentLost);
      this.lastProcessedRoundResultKey =
        typeof payload.lastProcessedRoundResultKey === "string"
          ? payload.lastProcessedRoundResultKey
          : "";
      this.currentOpponent = this.bracket[this.currentRoundIndex] ?? null;
    },

    startNewTournament(options = {}) {
      const cleanup =
        typeof options.cleanup === "function" ? options.cleanup : null;
      const size = Number.isInteger(options.size) ? options.size : 4;
      const customBracket = Array.isArray(options.bracket)
        ? options.bracket
        : null;
      const selectedMode =
        options.mode === "bo5" ||
        options.mode === "bo3" ||
        options.mode === "survival"
          ? options.mode
          : this.mode;

      if (cleanup) cleanup();

      this.resetTournament();
      this.setMode(selectedMode);
      this.sessionType =
        options.sessionType === "daily" ? "daily" : "tournament";
      this.dailyChallengeId =
        typeof options.dailyChallengeId === "string"
          ? options.dailyChallengeId
          : "";
      clearGameState();

      const bracket = customBracket?.length
        ? customBracket
        : selectedMode === "survival"
          ? [buildSurvivalOpponent(0)]
          : buildTournament(size);
      this.setBracket(bracket);

      saveGameState({
        tournament: this.getPersistedState(),
      });
    },

    resumeTournament(options = {}) {
      const cleanup =
        typeof options.cleanup === "function" ? options.cleanup : null;

      if (cleanup) cleanup();

      const saved = loadGameState();
      const tournament = saved?.tournament;

      if (!this.hasValidSavedTournament(tournament)) {
        this.startNewTournament({ size: options.size });
        return { resumed: false };
      }

      this.hydrateFromStorage(tournament);
      saveGameState({
        tournament: this.getPersistedState(),
      });

      return { resumed: true };
    },

    getPersistedState() {
      return {
        mode: this.mode,
        sessionType: this.sessionType,
        dailyChallengeId: this.dailyChallengeId,
        playerScore: this.playerScore,
        aiScore: this.aiScore,
        survivalScore: this.survivalScore,
        survivalOpponentsDefeated: this.survivalOpponentsDefeated,
        survivalRoundWins: this.survivalRoundWins,
        survivalRoundDraws: this.survivalRoundDraws,
        bracket: this.bracket,
        currentRoundIndex: this.currentRoundIndex,
        matchFinished: this.matchFinished,
        tournamentFinished: this.tournamentFinished,
        tournamentLost: this.tournamentLost,
        lastProcessedRoundResultKey: this.lastProcessedRoundResultKey,
      };
    },

    isDuplicateRoundResult(resultKey) {
      if (typeof resultKey !== "string" || !resultKey.length) return false;
      return this.lastProcessedRoundResultKey === resultKey;
    },

    markRoundResultProcessed(resultKey) {
      this.lastProcessedRoundResultKey =
        typeof resultKey === "string" ? resultKey : "";
    },

    clearRoundResultTracking() {
      this.lastProcessedRoundResultKey = "";
    },

    getCurrentOpponentDifficultyTier() {
      const tier = Number(this.currentOpponent?.aiProfile?.difficultyTier);
      if (!Number.isFinite(tier)) return 1;
      return Math.max(1, Math.min(Math.round(tier), 5));
    },

    getSurvivalMatchBonus() {
      const flawlessBonus = Math.max(this.targetWins - this.aiScore, 0) * 22;
      const difficultyBonus = this.getCurrentOpponentDifficultyTier() * 14;
      const streakBonus = Math.min(this.survivalOpponentsDefeated, 20) * 5;
      return 120 + flawlessBonus + difficultyBonus + streakBonus;
    },

    setOpponent(opponent) {
      this.currentOpponent = opponent;
    },

    registerRoundResult(winner) {
      if (this.matchFinished || this.tournamentFinished) return;

      if (winner === "player") {
        this.playerScore += 1;
        if (this.mode === "survival") {
          this.survivalRoundWins += 1;
          this.survivalScore += 16;
        }
      } else if (winner === "ai") {
        this.aiScore += 1;
      } else if (winner === "draw") {
        if (this.mode === "survival") {
          this.survivalRoundDraws += 1;
          this.survivalScore += 4;
        }
        return;
      }

      this.checkMatchEnd();
    },

    checkMatchEnd() {
      if (this.playerScore >= this.targetWins) {
        this.matchFinished = true;
        this.markCurrentOpponentStatus("defeated");

        if (this.mode === "survival") {
          this.survivalOpponentsDefeated += 1;
          this.survivalScore += this.getSurvivalMatchBonus();
          return;
        }

        if (this.isLastOpponent) {
          this.tournamentFinished = true;
          this.currentOpponent = null;
        }

        return;
      }

      if (this.aiScore >= this.targetWins) {
        this.matchFinished = true;
        this.tournamentFinished = true;
        this.tournamentLost = true;
        this.markCurrentOpponentStatus("lost");
      }
    },

    markCurrentOpponentStatus(status) {
      const currentNode = this.bracket[this.currentRoundIndex];
      if (!currentNode) return;

      currentNode.status = status;
    },

    advanceOpponent() {
      if (!this.matchFinished) return;
      if (this.tournamentFinished) return;

      if (this.mode !== "survival" && this.isLastOpponent) return;

      const nextIndex = this.currentRoundIndex + 1;
      if (this.mode === "survival" && !this.bracket[nextIndex]) {
        this.bracket.push(buildSurvivalOpponent(nextIndex));
      }

      const nextOpponent = this.bracket[nextIndex];

      if (!nextOpponent) {
        this.currentOpponent = null;
        this.tournamentFinished = true;
        return;
      }

      this.currentRoundIndex = nextIndex;
      this.currentOpponent = nextOpponent;
      this.playerScore = 0;
      this.aiScore = 0;
      this.matchFinished = false;
      this.lastProcessedRoundResultKey = "";

      this.bracket.forEach((node, index) => {
        if (index < nextIndex && node.status !== "lost") {
          node.status = "defeated";
        } else if (index === nextIndex) {
          node.status = "current";
        } else if (index > nextIndex && node.status !== "lost") {
          node.status = "pending";
        }
      });
    },

    resetMatch() {
      this.playerScore = 0;
      this.aiScore = 0;
      this.matchFinished = false;
      this.lastProcessedRoundResultKey = "";
    },

    resetTournament() {
      this.mode = "bo3";
      this.targetWins = 3;
      this.sessionType = "tournament";
      this.dailyChallengeId = "";
      this.playerScore = 0;
      this.aiScore = 0;
      this.survivalScore = 0;
      this.survivalOpponentsDefeated = 0;
      this.survivalRoundWins = 0;
      this.survivalRoundDraws = 0;
      this.currentOpponent = null;
      this.bracket = [];
      this.currentRoundIndex = 0;
      this.matchFinished = false;
      this.tournamentFinished = false;
      this.tournamentLost = false;
      this.lastProcessedRoundResultKey = "";
    },
  },
});
