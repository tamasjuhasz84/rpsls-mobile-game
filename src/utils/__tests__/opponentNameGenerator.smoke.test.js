import { describe, it, expect } from "vitest";
import {
  generateOpponentName,
  generateSeededOpponentName,
} from "@/utils/opponentNameGenerator";

describe("opponentNameGenerator", () => {
  it("alap generátor nem üres nevet ad", () => {
    const name = generateOpponentName();
    expect(typeof name).toBe("string");
    expect(name.length).toBeGreaterThan(0);
  });

  it("seedelt generátor azonos seed+archetype esetén determinisztikus", () => {
    const nameA = generateSeededOpponentName(42, { archetypeKey: "wildCard" });
    const nameB = generateSeededOpponentName(42, { archetypeKey: "wildCard" });

    expect(nameA).toBe(nameB);
  });

  it("ugyanazzal a seeddel eltérő archetype más nevet adhat", () => {
    const wildCard = generateSeededOpponentName(42, {
      archetypeKey: "wildCard",
    });
    const grandmaster = generateSeededOpponentName(42, {
      archetypeKey: "grandmaster",
    });

    expect(wildCard).not.toBe(grandmaster);
  });
});
