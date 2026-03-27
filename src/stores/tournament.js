import { defineStore } from "pinia";
import { buildTournament } from "@/utils/tournamentBuilder";
import { saveGameState, loadGameState, clearGameState } from "@/utils/storage";

export const useTournamentStore = defineStore("tournament", {
  state: () => ({
    mode: "bo3",
    targetWins: 3,
    playerScore: 0,
    aiScore: 0,
    currentOpponent: null,
    bracket: [],
    currentRoundIndex: 0,
    matchFinished: false,
    tournamentFinished: false,
    tournamentLost: false,
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
      this.mode = mode === "bo5" ? "bo5" : "bo3";
      this.targetWins = this.mode === "bo5" ? 5 : 3;
    },

    setBracket(bracket = []) {
      this.bracket = bracket;
      this.currentRoundIndex = 0;
      this.currentOpponent = bracket[0] ?? null;
      this.playerScore = 0;
      this.aiScore = 0;
      this.matchFinished = false;
      this.tournamentFinished = false;
      this.tournamentLost = false;

      this.bracket.forEach((node, index) => {
        node.status = index === 0 ? "current" : "pending";
      });
    },

    hydrateFromStorage(payload = {}) {
      this.mode = payload.mode === "bo5" ? "bo5" : "bo3";
      this.targetWins = this.mode === "bo5" ? 5 : 3;
      this.playerScore = this.normalizeNonNegativeNumber(
        payload.playerScore,
        0,
      );
      this.aiScore = this.normalizeNonNegativeNumber(payload.aiScore, 0);
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
      this.currentOpponent = this.bracket[this.currentRoundIndex] ?? null;
    },

    startNewTournament(options = {}) {
      const cleanup =
        typeof options.cleanup === "function" ? options.cleanup : null;
      const size = Number.isInteger(options.size) ? options.size : 4;

      if (cleanup) cleanup();

      this.resetTournament();
      clearGameState();

      const bracket = buildTournament(size);
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
        playerScore: this.playerScore,
        aiScore: this.aiScore,
        bracket: this.bracket,
        currentRoundIndex: this.currentRoundIndex,
        matchFinished: this.matchFinished,
        tournamentFinished: this.tournamentFinished,
        tournamentLost: this.tournamentLost,
      };
    },

    setOpponent(opponent) {
      this.currentOpponent = opponent;
    },

    registerRoundResult(winner) {
      if (this.matchFinished || this.tournamentFinished) return;

      if (winner === "player") {
        this.playerScore += 1;
      } else if (winner === "ai") {
        this.aiScore += 1;
      } else if (winner === "draw") {
        return;
      }

      this.checkMatchEnd();
    },

    checkMatchEnd() {
      if (this.playerScore >= this.targetWins) {
        this.matchFinished = true;
        this.markCurrentOpponentStatus("defeated");

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
      if (this.isLastOpponent) return;

      const nextIndex = this.currentRoundIndex + 1;
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
    },

    resetTournament() {
      this.mode = "bo3";
      this.targetWins = 3;
      this.playerScore = 0;
      this.aiScore = 0;
      this.currentOpponent = null;
      this.bracket = [];
      this.currentRoundIndex = 0;
      this.matchFinished = false;
      this.tournamentFinished = false;
      this.tournamentLost = false;
    },
  },
});
