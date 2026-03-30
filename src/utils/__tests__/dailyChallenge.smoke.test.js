import { describe, it, expect } from "vitest";
import {
  buildDailyChallengeDefinition,
  createSeededRandom,
  getDailyChallengeDateKey,
  hashStringToSeed,
} from "@/utils/dailyChallenge";

describe("dailyChallenge utils", () => {
  it("ugyanarra a dátumra ugyanazt a dateKey-t adja", () => {
    const date = new Date(2026, 2, 30, 10, 0, 0);
    expect(getDailyChallengeDateKey(date)).toBe("2026-03-30");
  });

  it("hashStringToSeed determinisztikus", () => {
    expect(hashStringToSeed("2026-03-30")).toBe(hashStringToSeed("2026-03-30"));
  });

  it("ugyanazzal a seed-del a random sorozat azonos", () => {
    const randomA = createSeededRandom(1234);
    const randomB = createSeededRandom(1234);
    expect([randomA(), randomA(), randomA()]).toStrictEqual([
      randomB(),
      randomB(),
      randomB(),
    ]);
  });

  it("ugyanarra a napra ugyanazt a challenge definíciót adja", () => {
    const date = new Date(2026, 2, 30, 10, 0, 0);
    const first = buildDailyChallengeDefinition(date);
    const second = buildDailyChallengeDefinition(date);

    expect(second).toStrictEqual(first);
  });

  it("ugyanazon a napon eltérő időpontban is azonos challenge készül", () => {
    const morning = buildDailyChallengeDefinition(
      new Date(2026, 2, 30, 8, 0, 0),
    );
    const evening = buildDailyChallengeDefinition(
      new Date(2026, 2, 30, 23, 59, 59),
    );

    expect(evening).toStrictEqual(morning);
  });

  it("különböző napra eltérő challenge id készül", () => {
    const first = buildDailyChallengeDefinition(new Date(2026, 2, 30));
    const second = buildDailyChallengeDefinition(new Date(2026, 2, 31));

    expect(second.id).not.toBe(first.id);
  });

  it("a challenge 3 és 5 közötti ellenfelet tartalmaz", () => {
    const challenge = buildDailyChallengeDefinition(new Date(2026, 2, 30));
    expect(challenge.bracketSize).toBeGreaterThanOrEqual(3);
    expect(challenge.bracketSize).toBeLessThanOrEqual(5);
    expect(challenge.bracket).toHaveLength(challenge.bracketSize);
  });

  it("a bracket első eleme current, a többi pending", () => {
    const challenge = buildDailyChallengeDefinition(new Date(2026, 2, 30));
    expect(challenge.bracket[0].status).toBe("current");
    challenge.bracket.slice(1).forEach((node) => {
      expect(node.status).toBe("pending");
    });
  });

  it("a mode bo3 vagy bo5", () => {
    const challenge = buildDailyChallengeDefinition(new Date(2026, 2, 30));
    expect(["bo3", "bo5"]).toContain(challenge.mode);
  });

  it("targetWins a mode-ból vezetődik le", () => {
    const challenge = buildDailyChallengeDefinition(new Date(2026, 2, 30));
    const expectedWins = challenge.mode === "bo5" ? 5 : 3;

    expect(challenge.targetWins).toBe(expectedWins);
  });
});
