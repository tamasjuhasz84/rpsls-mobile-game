import { describe, it, expect } from "vitest";
import { buildShareResultText } from "@/utils/shareResult";

describe("buildShareResultText", () => {
  it("tournament módban meccs score sort épít", () => {
    const text = buildShareResultText({
      appTitle: "RPSLS Tournament",
      modeLabel: "BO3",
      resultLabel: "Victory",
      playerScore: 3,
      aiScore: 1,
      opponentsDefeated: 2,
      labels: {
        mode: "Mode",
        result: "Result",
        matchScore: "Match score",
        opponents: "Opponents defeated",
      },
    });

    expect(text).toContain("Match score: 3-1");
    expect(text).toContain("Opponents defeated: 2");
    expect(text).toContain("#RPSLS");
  });

  it("survival módban run score sort épít", () => {
    const text = buildShareResultText({
      isSurvival: true,
      modeLabel: "Survival",
      resultLabel: "Run ended",
      survivalScore: 512,
      opponentsDefeated: 5,
      winStreak: 4,
      labels: {
        mode: "Mode",
        result: "Result",
        survivalScore: "Run score",
        opponents: "Opponents defeated",
        winStreak: "Win streak",
      },
    });

    expect(text).toContain("Run score: 512");
    expect(text).toContain("Win streak: 4");
    expect(text).not.toContain("Match score:");
  });
});
