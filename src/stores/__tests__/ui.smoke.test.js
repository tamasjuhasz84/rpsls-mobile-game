import { describe, it, expect } from "vitest";
import { useUiStore } from "@/stores/ui";
import { loadUiState } from "@/utils/storage";

describe("ui store feature flags", () => {
  it("hydrateFromStorage default flag értékekkel egészíti ki a hiányos payloadot", () => {
    const store = useUiStore();

    store.hydrateFromStorage({
      locale: "en",
      featureFlags: {
        tutorialOverlay: false,
      },
    });

    expect(store.locale).toBe("en");
    expect(store.featureFlags.tutorialOverlay).toBe(false);
    expect(store.featureFlags.dailyChallengePromo).toBe(true);
    expect(store.featureFlags.matchEndMotivationPanel).toBe(true);
  });

  it("setFeatureFlag perzisztalja a valtozast", () => {
    const store = useUiStore();

    expect(store.setFeatureFlag("matchEndMotivationPanel", false)).toBe(true);
    expect(store.isFeatureEnabled("matchEndMotivationPanel")).toBe(false);
    expect(loadUiState()?.featureFlags?.matchEndMotivationPanel).toBe(false);
  });

  it("runtime override felulirja a persisted flaget, de nem irja felul a tarolt allapotot", () => {
    const store = useUiStore();

    store.setFeatureFlag("tutorialOverlay", true);
    store.applyRuntimeFeatureFlagOverrides({ tutorialOverlay: false });

    expect(store.isFeatureEnabled("tutorialOverlay")).toBe(false);
    expect(loadUiState()?.featureFlags?.tutorialOverlay).toBe(true);
  });

  it("ismeretlen flaget nem enged beallitani", () => {
    const store = useUiStore();

    expect(store.setFeatureFlag("unknownFlag", false)).toBe(false);
  });
});
