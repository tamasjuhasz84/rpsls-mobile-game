import { defineStore } from "pinia";
import { saveUiState } from "@/utils/storage";
import {
  DEFAULT_FEATURE_FLAGS,
  normalizeFeatureFlags,
} from "@/utils/featureFlags";

export const useUiStore = defineStore("ui", {
  state: () => ({
    locale: "hu",
    soundEnabled: false,
    hapticsEnabled: false,
    playerName: "",
    fatalError: null,
    featureFlags: { ...DEFAULT_FEATURE_FLAGS },
    runtimeFeatureFlagOverrides: {},
  }),

  getters: {
    isHungarian: (state) => state.locale === "hu",
    isEnglish: (state) => state.locale === "en",
    hasFatalError: (state) => Boolean(state.fatalError),
    activeFeatureFlags: (state) => ({
      ...state.featureFlags,
      ...state.runtimeFeatureFlagOverrides,
    }),
    isFeatureEnabled: (state) => (key) => {
      if (typeof state.runtimeFeatureFlagOverrides[key] === "boolean") {
        return state.runtimeFeatureFlagOverrides[key];
      }

      return state.featureFlags[key] === true;
    },
  },

  actions: {
    normalizePlayerName(value) {
      if (typeof value !== "string") return "";
      return value.trim().slice(0, 20);
    },

    persistUiState() {
      saveUiState({
        locale: this.locale,
        soundEnabled: this.soundEnabled,
        hapticsEnabled: this.hapticsEnabled,
        playerName: this.playerName,
        featureFlags: this.featureFlags,
      });
    },

    setPlayerName(name) {
      this.playerName = this.normalizePlayerName(name);
      this.persistUiState();
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
      this.playerName = this.normalizePlayerName(payload.playerName);
      this.featureFlags = normalizeFeatureFlags(payload.featureFlags);
      this.runtimeFeatureFlagOverrides = {};
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      this.persistUiState();
    },

    toggleHaptics() {
      this.hapticsEnabled = !this.hapticsEnabled;
      this.persistUiState();
    },

    setFeatureFlag(key, enabled) {
      if (!(key in DEFAULT_FEATURE_FLAGS)) return false;
      if (typeof enabled !== "boolean") return false;

      this.featureFlags = {
        ...this.featureFlags,
        [key]: enabled,
      };
      this.persistUiState();
      return true;
    },

    applyRuntimeFeatureFlagOverrides(payload = {}) {
      this.runtimeFeatureFlagOverrides = normalizeFeatureFlags(payload, {
        allowPartial: true,
      });

      return Object.keys(this.runtimeFeatureFlagOverrides).length;
    },

    clearRuntimeFeatureFlagOverrides() {
      this.runtimeFeatureFlagOverrides = {};
    },

    setFatalError(payload = {}) {
      const source =
        typeof payload.source === "string" && payload.source.length > 0
          ? payload.source
          : "runtime";

      this.fatalError = {
        source,
        at: Date.now(),
      };
    },

    clearFatalError() {
      this.fatalError = null;
    },
  },
});
