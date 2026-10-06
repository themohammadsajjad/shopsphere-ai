import { expect, test } from "@playwright/test";

test("loads the storefront homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/ShopSphere AI/i);
});
