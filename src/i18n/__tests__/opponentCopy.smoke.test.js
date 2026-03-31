import { describe, it, expect } from "vitest";
import en from "@/i18n/locales/en.json";
import hu from "@/i18n/locales/hu.json";

const OPPONENT_ARCHETYPES = [
  "rookieBluffer",
  "patternHunter",
  "signalReader",
  "momentumBreaker",
  "wildCard",
  "grandmaster",
];

function collectOpponentKeys(dict) {
  return Object.keys(dict).filter((key) => key.startsWith("opponent."));
}

describe("opponent copy localization", () => {
  it("EN and HU contain the same opponent key set", () => {
    const enKeys = collectOpponentKeys(en).sort();
    const huKeys = collectOpponentKeys(hu).sort();

    expect(huKeys).toEqual(enKeys);
  });

  it("all opponent strings are non-empty in EN and HU", () => {
    const keys = collectOpponentKeys(en);

    keys.forEach((key) => {
      expect(typeof en[key]).toBe("string");
      expect(typeof hu[key]).toBe("string");
      expect(en[key].trim().length).toBeGreaterThan(0);
      expect(hu[key].trim().length).toBeGreaterThan(0);
    });
  });

  it("every archetype has label/personality/flavor and exactly 3 intro lines", () => {
    OPPONENT_ARCHETYPES.forEach((archetype) => {
      ["label", "personality", "flavor"].forEach((field) => {
        const key = `opponent.archetype.${archetype}.${field}`;
        expect(en[key]).toBeTruthy();
        expect(hu[key]).toBeTruthy();
      });

      [0, 1, 2].forEach((index) => {
        const key = `opponent.intro.${archetype}.${index}`;
        expect(en[key]).toBeTruthy();
        expect(hu[key]).toBeTruthy();
      });
    });
  });
});
