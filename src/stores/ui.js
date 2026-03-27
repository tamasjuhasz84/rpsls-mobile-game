import { defineStore } from "pinia";
import { saveUiState } from "@/utils/storage";

export const useUiStore = defineStore("ui", {
  state: () => ({
    locale: "hu",
    soundEnabled: false,
    hapticsEnabled: false,
  }),

  getters: {
    isHungarian: (state) => state.locale === "hu",
    isEnglish: (state) => state.locale === "en",
  },

  actions: {
    persistUiState() {
      saveUiState({
        locale: this.locale,
        soundEnabled: this.soundEnabled,
        hapticsEnabled: this.hapticsEnabled,
      });
    },

    setLocale(locale) {
      this.locale = locale === "en" ? "en" : "hu";
      this.persistUiState();
    },

    toggleLocale() {
      this.locale = this.locale === "hu" ? "en" : "hu";
      this.persistUiState();
    },

    hydrateFromStorage(payload = {}) {
      this.locale = payload.locale === "en" ? "en" : "hu";
      this.soundEnabled = payload.soundEnabled === true;
      this.hapticsEnabled = payload.hapticsEnabled === true;
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      this.persistUiState();
    },

    toggleHaptics() {
      this.hapticsEnabled = !this.hapticsEnabled;
      this.persistUiState();
    },
  },
});
