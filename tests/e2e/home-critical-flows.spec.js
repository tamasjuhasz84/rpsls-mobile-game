import { expect, test } from "@playwright/test";

const LOCAL_STORAGE_GAME_KEY = "rpsls-game-state";
const LOCAL_STORAGE_ONBOARDING_KEY = "rpsls-onboarding";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ completed: true, completedAt: Date.now() })
    );
  }, LOCAL_STORAGE_ONBOARDING_KEY);
});

test("home start navigates to game", async ({ page }) => {
  await page.goto("/");

  await page.locator(".home-primary-actions .primary-button").click();

  await expect(page).toHaveURL(/\/game/);
  await expect(page.locator(".game-layout")).toBeVisible();
});

test("mode switch updates selected state", async ({ page }) => {
  await page.goto("/");

  const modeButtons = page.locator(".mode-switch button");

  await modeButtons.nth(1).click();
  await expect(modeButtons.nth(1)).toHaveAttribute("aria-pressed", "true");

  await modeButtons.nth(2).click();
  await expect(modeButtons.nth(2)).toHaveAttribute("aria-pressed", "true");
});

test("continue resumes saved tournament", async ({ page }) => {
  await page.addInitScript((storageKey) => {
    const savedState = {
      tournament: {
        mode: "bo3",
        sessionType: "tournament",
        playerScore: 1,
        aiScore: 0,
        bracket: [{ id: 1, name: "Alpha" }],
        currentRoundIndex: 0,
        matchFinished: false,
        tournamentFinished: false,
        tournamentLost: false,
      },
    };

    window.localStorage.setItem(storageKey, JSON.stringify(savedState));
  }, LOCAL_STORAGE_GAME_KEY);

  await page.goto("/");

  const continueButton = page
    .locator(".home-primary-actions .button-stack > button.secondary-button")
    .first();

  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(page).toHaveURL(/\/game\?resume=1/);
  await expect(page.locator(".game-layout")).toBeVisible();
});
