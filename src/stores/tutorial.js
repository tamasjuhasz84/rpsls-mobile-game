import { defineStore } from "pinia";
import { loadOnboardingState, saveOnboardingState } from "@/utils/storage";

export const TUTORIAL_STEP_COUNT = 5;

export const useTutorialStore = defineStore("tutorial", {
  state: () => ({
    status: "idle", // "idle" | "active" | "done"
    currentStep: 0,
  }),

  getters: {
    isActive: (state) => state.status === "active",
    isDone: (state) => state.status === "done",
    stepCount: () => TUTORIAL_STEP_COUNT,
    isLastStep: (state) => state.currentStep >= TUTORIAL_STEP_COUNT - 1,
    progress: (state) => state.currentStep / (TUTORIAL_STEP_COUNT - 1),
  },

  actions: {
    init() {
      const saved = loadOnboardingState();
      if (saved?.completed === true) {
        this.status = "done";
        this.currentStep = TUTORIAL_STEP_COUNT - 1;
        return false;
      }
      this.status = "active";
      this.currentStep = 0;
      return true;
    },

    advance() {
      if (this.status !== "active") return false;
      if (this.isLastStep) {
        this._complete();
        return true;
      }
      this.currentStep += 1;
      return false;
    },

    skip() {
      if (this.status !== "active") return false;
      this._complete();
      return true;
    },

    _complete() {
      this.status = "done";
      this.currentStep = TUTORIAL_STEP_COUNT - 1;
      saveOnboardingState({ completed: true, completedAt: Date.now() });
    },
  },
});
