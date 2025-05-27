import { expect, test } from "@playwright/test";

test.describe("Escape The Web – E2E flow", () => {
  test.beforeEach(async ({ page }) => {
    // Make sure the app is running on :3000 or adjust as needed
    await page.goto("/");
  });

  test("SafePuzzle: shows error on wrong code, then advances on correct code", async ({ page }) => {
    // Wrong code
    await page.fill('input[placeholder="____"]', "0000");
    await page.click('button:has-text("Unlock")');
    await expect(page.locator("text=Wrong code, try again!")).toBeVisible();

    // Correct code
    await page.fill('input[placeholder="____"]', "1234");
    await page.click('button:has-text("Unlock")');

    // After success we should see the HiddenWordPuzzle riddle
    await expect(
      page.getByText(/I power web UIs with components and hooks/i),
    ).toBeVisible();
  });

  test("HiddenWordPuzzle: error on empty/wrong, advances on correct guess", async ({ page }) => {
    // First solve SafePuzzle
    await page.fill('input[placeholder="____"]', "1234");
    await page.click('button:has-text("Unlock")');

    // Empty guess
    await page.click('button:has-text("Submit Guess")');
    await expect(
      page.locator("text=Not quite—try again!"),
    ).toBeVisible();

    // Wrong guess
    await page.fill('input[role="textbox"]', "WRONG");
    await page.click('button:has-text("Submit Guess")');
    await expect(
      page.locator("text=Not quite—try again!"),
    ).toBeVisible();

    // Correct guess (case-insensitive)
    await page.fill('input[role="textbox"]', "react");
    await page.click('button:has-text("Submit Guess")');

    // After success we should see the ColorOrderPuzzle riddle
    await expect(
      page.getByText(/First the calm before the storm/i),
    ).toBeVisible();
  });

  test("ColorOrderPuzzle: wrong sequence shows error, Clear works, correct sequence shows success", async ({ page }) => {
    // Solve Safe
    await page.fill('input[placeholder="____"]', "1234");
    await page.click('button:has-text("Unlock")');
    // Solve HiddenWord
    await page.click('button:has-text("Submit Guess")'); // empty
    await page.fill('input[role="textbox"]', "react");
    await page.click('button:has-text("Submit Guess")');

    // Now on ColorOrderPuzzle: verify riddle
    await expect(
      page.getByText(/First the calm before the storm/i),
    ).toBeVisible();

    // Wrong 3-click sequence: blue → red → green
    await page.click('button[aria-label="blue"]');
    await page.click('button[aria-label="red"]');
    await page.click('button[aria-label="green"]');
    await expect(
      page.locator("text=That's not quite right—try again!"),
    ).toBeVisible();
    // Guess chips cleared
    await expect(page.locator('[data-testid="guess-chip"]')).toHaveCount(0);

    // Partial guess then Clear
    await page.click('button[aria-label="blue"]');
    await page.click('button[aria-label="red"]');
    await expect(page.locator('[data-testid="guess-chip"]')).toHaveCount(2);
    await page.click('button:has-text("Clear Guess")');
    await expect(page.locator('[data-testid="guess-chip"]')).toHaveCount(0);

    // Correct sequence: blue → red → yellow
    await page.click('button[aria-label="blue"]');
    await page.click('button[aria-label="red"]');
    await page.click('button[aria-label="yellow"]');
    // Success message
    await expect(
      page.locator("text=All puzzles complete!"),
    ).toBeVisible();
  });

  test("Out-of-order: solve HiddenWord first → ColorOrder → Safe → fallback", async ({ page }) => {
    // Jump straight to Hidden Word
    await page.click('button:has-text("Hidden Word")');
    // Solve Hidden Word
    await page.fill('input[role="textbox"]', "react");
    await page.click('button:has-text("Submit Guess")');

    // Should now be on Color Order
    await expect(
      page.getByText(/First the calm before the storm/i),
    ).toBeVisible();

    // Solve Color Order
    await page.click('button[aria-label="blue"]');
    await page.click('button[aria-label="red"]');
    await page.click('button[aria-label="yellow"]');

    // Should now be on Safe Puzzle
    await expect(
      page.getByText(/Enter the 4-digit code/i),
    ).toBeVisible();

    // Solve Safe Puzzle
    await page.fill('input[placeholder="____"]', "1234");
    await page.click('button:has-text("Unlock")');

    // Finally, fallback
    await expect(
      page.getByText(/All puzzles complete!/i),
    ).toBeVisible();
  });

  test("Out-of-order: solve ColorOrder first → Safe → HiddenWord → fallback", async ({ page }) => {
    // Jump to Color Order first
    await page.click('button:has-text("Color Order")');

    // Solve Color Order
    await page.click('button[aria-label="blue"]');
    await page.click('button[aria-label="red"]');
    await page.click('button[aria-label="yellow"]');

    // Next unsolved should be Safe Puzzle
    await expect(
      page.getByText(/Enter the 4-digit code/i),
    ).toBeVisible();

    // Solve Safe Puzzle
    await page.fill('input[placeholder="____"]', "1234");
    await page.click('button:has-text("Unlock")');

    // Next should be Hidden Word
    await expect(
      page.getByText(/I power web UIs with components and hooks/i),
    ).toBeVisible();

    // Solve Hidden Word
    await page.fill('input[role="textbox"]', "react");
    await page.click('button:has-text("Submit Guess")');

    // Finally, fallback
    await expect(
      page.getByText(/All puzzles complete!/i),
    ).toBeVisible();
  });
});
