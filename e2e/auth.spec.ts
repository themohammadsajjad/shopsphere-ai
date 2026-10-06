import { expect, test } from "@playwright/test";

test("redirects an unauthenticated user to login", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});

test("logs in a customer and restores the session after refresh", async ({
  page,
}) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Customer demo" }).click();
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Your dashboard" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Admin" }),
  ).toHaveCount(0);

  await page.reload();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByText("Signed in as Demo Customer"),
  ).toBeVisible();
});

test("returns to the requested protected route after login", async ({
  page,
}) => {
  await page.goto("/checkout");

  await expect(page).toHaveURL(/\/login\?next=%2Fcheckout/);

  await page.getByRole("button", { name: "Customer demo" }).click();
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(
    page.getByRole("heading", {
      name: "Checkout",
      exact: true,
    }),
  ).toBeVisible();
});

test("logs in an administrator and opens the admin dashboard", async ({
  page,
}) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Admin demo" }).click();
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Admin dashboard" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Admin" }),
  ).toBeVisible();
});

test("prevents a customer from accessing the admin route", async ({
  page,
}) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Customer demo" }).click();
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/admin");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Your dashboard" }),
  ).toBeVisible();
});

test("registers a new customer account", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("Full name").fill("Playwright Shopper");
  await page.getByLabel("Email address").fill("playwright@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByLabel("Confirm password").fill("password123");

  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByText("Signed in as Playwright Shopper"),
  ).toBeVisible();
});

test("logs out and blocks protected routes again", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Customer demo" }).click();
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Sign out" }).click();

  await expect(page).toHaveURL(/\/login(?:\?next=%2Fdashboard)?$/);

  await page.goto("/orders");

  await expect(page).toHaveURL(/\/login\?next=%2Forders/);
});
