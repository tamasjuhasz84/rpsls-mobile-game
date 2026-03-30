import { describe, it, expect } from "vitest";
import {
  buildTournament,
  buildSurvivalOpponent,
} from "@/utils/tournamentBuilder";

describe("buildTournament", () => {
  it("méret=4 esetén 4 elemű tömböt ad vissza", () => {
    const bracket = buildTournament(4);
    expect(bracket).toHaveLength(4);
  });

  it("minden csomópontnak van id, name, status, aiProfile mezője", () => {
    buildTournament(4).forEach((node) => {
      expect(typeof node.id).toBe("number");
      expect(typeof node.name).toBe("string");
      expect(node.name.length).toBeGreaterThan(0);
      expect(typeof node.status).toBe("string");
      expect(typeof node.archetypeKey).toBe("string");
      expect(node.archetypeKey.length).toBeGreaterThan(0);
      expect(typeof node.opponentIntroKey).toBe("string");
      expect(node.opponentIntroKey.length).toBeGreaterThan(0);
      expect(node.aiProfile).toBeDefined();
      expect(typeof node.aiProfile).toBe("object");
    });
  });

  it("az első csomópont státusza 'current'", () => {
    expect(buildTournament(4)[0].status).toBe("current");
  });

  it("a többi csomópont státusza 'pending'", () => {
    buildTournament(4)
      .slice(1)
      .forEach((node) => {
        expect(node.status).toBe("pending");
      });
  });

  it("az id értékek 1-től n-ig szekvenciálisak", () => {
    buildTournament(4).forEach((node, index) => {
      expect(node.id).toBe(index + 1);
    });
  });

  it("érvénytelen/nulla méret esetén 4 elemmel tér vissza", () => {
    expect(buildTournament(0)).toHaveLength(4);
    expect(buildTournament(-1)).toHaveLength(4);
    expect(buildTournament("bad")).toHaveLength(4);
  });

  it("aiProfile tartalmaz strategyType mezőt", () => {
    buildTournament(4).forEach((node) => {
      expect(typeof node.aiProfile.strategyType).toBe("string");
    });
  });

  it("méret=2 esetén 2 elemű tömböt ad vissza", () => {
    expect(buildTournament(2)).toHaveLength(2);
  });

  it("méret=8 esetén 8 elemű tömböt ad vissza", () => {
    expect(buildTournament(8)).toHaveLength(8);
  });

  it("survival ellenfél node építésnél helyes mezőket ad", () => {
    const node = buildSurvivalOpponent(5);

    expect(node.id).toBe(6);
    expect(typeof node.name).toBe("string");
    expect(node.name.length).toBeGreaterThan(0);
    expect(typeof node.archetypeKey).toBe("string");
    expect(typeof node.aiProfile).toBe("object");
    expect(node.status).toBe("pending");
  });
});
