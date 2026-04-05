import { expect, test } from "@playwright/test";

const LOCAL_STORAGE_GAME_KEY = "rpsls-game-state";
const LOCAL_STORAGE_ONBOARDING_KEY = "rpsls-onboarding";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((onboardingKey) => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem(
      onboardingKey,
      JSON.stringify({ completed: true, completedAt: Date.now() })
    );
  }, LOCAL_STORAGE_ONBOARDING_KEY);
});

test("game round flow reaches result state", async ({ page }) => {
  await page.goto("/game");

  const firstMoveButton = page.locator(".move-list .move-button").first();
  await expect(firstMoveButton).toBeVisible();
  await firstMoveButton.click();
  await expect(firstMoveButton).toHaveAttribute("aria-pressed", "true");

  await expect(page.locator(".game-board .result-text")).toBeVisible({
    timeout: 12000,
  });

  const resultText = await page.locator(".game-board .result-text").innerText();
  expect(resultText.trim().length).toBeGreaterThan(0);
});

test("match-end panel advance continues to next opponent", async ({ page }) => {
  await page.addInitScript((storageKey) => {
    const savedState = {
      tournament: {
        mode: "bo3",
        sessionType: "tournament",
        dailyChallengeId: "",
        playerScore: 3,
        aiScore: 1,
        survivalScore: 0,
        survivalOpponentsDefeated: 0,
        survivalRoundWins: 0,
        survivalRoundDraws: 0,
        bracket: [
          { id: 1, name: "Alpha" },
          { id: 2, name: "Beta" },
        ],
        currentRoundIndex: 0,
        matchFinished: true,
        tournamentFinished: false,
        tournamentLost: false,
        lastProcessedRoundResultKey: "",
      },
    };

    window.localStorage.setItem(storageKey, JSON.stringify(savedState));
  }, LOCAL_STORAGE_GAME_KEY);

  await page.goto("/game?resume=1");

  const matchPanel = page.locator(".match-status-panel");
  await expect(matchPanel).toBeVisible();

  const advanceButton = matchPanel.locator(".primary-button").first();
  await expect(advanceButton).toBeVisible();
  await advanceButton.click();

  await expect(matchPanel).toBeHidden({ timeout: 6000 });
  await expect(page.locator(".game-layout")).toBeVisible();

  const scoreValues = page.locator(".score-main .score-value");
  await expect(scoreValues.nth(0)).toHaveText("0");
  await expect(scoreValues.nth(1)).toHaveText("0");
});
