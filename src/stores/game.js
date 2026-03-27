import { defineStore } from "pinia";
import { MOVES, getWinner, getExplanationKey } from "@/utils/gameRules";

export const useGameStore = defineStore("game", {
  state: () => ({
    phase: "idle",
    currentMove: null,
    lockedMove: null,
    aiMove: null,
    countdown: 5,
    result: null,
    explanationKey: "",
    roundNumber: 1,
    isCountdownRunning: false,
  }),

  getters: {
    isIdle: (state) => state.phase === "idle",
    isCountdownPhase: (state) => state.phase === "countdown",
    isLockedPhase: (state) => state.phase === "locked",
    isRevealPhase: (state) => state.phase === "reveal",
    isResultPhase: (state) => state.phase === "result",
    hasSelectedMove: (state) => !!state.currentMove,
  },

  actions: {
    startRound() {
      this.phase = "countdown";
      this.currentMove = null;
      this.lockedMove = null;
      this.aiMove = null;
      this.countdown = 5;
      this.result = null;
      this.explanationKey = "";
      this.isCountdownRunning = true;
    },

    selectMove(move) {
      if (this.phase !== "countdown") return;
      if (!MOVES.includes(move)) return;

      this.currentMove = move;
    },

    tickCountdown() {
      if (!this.isCountdownRunning) return;
      if (this.phase !== "countdown") return;

      if (this.countdown > 1) {
        this.countdown -= 1;
        return;
      }

      this.countdown = 0;
      this.lockRound();
    },

    forceDefaultMove(defaultMove = "rock") {
      if (!this.currentMove) {
        this.currentMove = defaultMove;
      }
    },

    lockRound() {
      if (this.phase !== "countdown") return;

      this.forceDefaultMove("rock");
      this.lockedMove = this.currentMove;
      this.phase = "locked";
      this.isCountdownRunning = false;
    },

    setAiMove(move) {
      if (!MOVES.includes(move)) return;
      this.aiMove = move;
    },

    revealRound() {
      if (this.phase !== "locked") return;
      if (!this.lockedMove || !this.aiMove) return;

      this.phase = "reveal";
    },

    resolveRound() {
      if (!this.lockedMove || !this.aiMove) return;
      if (this.phase !== "reveal") return;

      this.result = getWinner(this.lockedMove, this.aiMove);
      this.explanationKey = getExplanationKey(this.lockedMove, this.aiMove);
      this.phase = "result";
    },

    nextRound() {
      this.roundNumber += 1;
      this.startRound();
    },

    resetRound() {
      this.phase = "idle";
      this.currentMove = null;
      this.lockedMove = null;
      this.aiMove = null;
      this.countdown = 5;
      this.result = null;
      this.explanationKey = "";
      this.isCountdownRunning = false;
    },

    resetGame() {
      this.phase = "idle";
      this.currentMove = null;
      this.lockedMove = null;
      this.aiMove = null;
      this.countdown = 5;
      this.result = null;
      this.explanationKey = "";
      this.roundNumber = 1;
      this.isCountdownRunning = false;
    },
  },
});
