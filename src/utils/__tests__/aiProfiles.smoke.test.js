import { describe, it, expect } from "vitest";
import {
  getAiProfileForOpponent,
  getOpponentArchetypeForSlot,
  normalizeAiProfile,
} from "@/utils/aiProfiles";

describe("getAiProfileForOpponent", () => {
  it("4-es bracketnél az első ellenfél kezdőbarát random profilt kap", () => {
    const profile = getAiProfileForOpponent(0, 4);

    expect(profile.strategyType).toBe("random");
    expect(profile.difficultyTier).toBe(1);
    expect(profile.adaptationChance).toBe(0);
    expect(profile.chaosFactor).toBe(0.03);
  });

  it("a második ellenfél favorite, visszafogott adaptációval", () => {
    const profile = getAiProfileForOpponent(1, 4);

    expect(profile.strategyType).toBe("favorite");
    expect(profile.difficultyTier).toBe(2);
    expect(profile.adaptationChance).toBeGreaterThanOrEqual(0.07);
    expect(profile.adaptationChance).toBeLessThan(0.09);
  });

  it("a boss továbbra is boss stratégia marad a végső körben", () => {
    const profile = getAiProfileForOpponent(7, 8);

    expect(profile.strategyType).toBe("boss");
    expect(profile.archetypeKey).toBe("grandmaster");
    expect(typeof profile.strategyFlavorKey).toBe("string");
    expect(profile.difficultyTier).toBe(5);
    expect(profile.favoriteMoves).toHaveLength(2);
    expect(profile.adaptationChance).toBeGreaterThan(0.5);
  });
});

describe("getOpponentArchetypeForSlot", () => {
  it("korai körben rookieBluffer archetype-ot ad", () => {
    const archetype = getOpponentArchetypeForSlot(0, 4);

    expect(archetype.key).toBe("rookieBluffer");
    expect(typeof archetype.introKey).toBe("string");
    expect(archetype.introKey.length).toBeGreaterThan(0);
  });

  it("utolsó körben grandmaster archetype-ot ad", () => {
    const archetype = getOpponentArchetypeForSlot(3, 4);

    expect(archetype.key).toBe("grandmaster");
    expect(archetype.strategyType).toBe("boss");
  });
});

describe("normalizeAiProfile", () => {
  it("biztonságosan clampeli a szélsőséges értékeket", () => {
    const profile = normalizeAiProfile({
      strategyType: "favorite",
      favoriteMoves: ["rock", "invalid"],
      adaptationChance: 99,
      chaosFactor: -5,
      difficultyTier: 99,
    });

    expect(profile.favoriteMoves).toEqual(["rock"]);
    expect(profile.adaptationChance).toBe(0.9);
    expect(profile.chaosFactor).toBe(0);
    expect(profile.difficultyTier).toBe(5);
  });
});
