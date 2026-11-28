import {
  expect,
  test,
} from "@playwright/test";

test(
  "homepage exposes required storefront entry points",
  async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole(
        "search",
      ),
     ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Featured Products",
        },
      ),
    ).toBeVisible();

    const primaryNavigation =
      page.getByRole(
        "navigation",
        {
          name:
            "Primary navigation",
        },
      );

    await expect(
      primaryNavigation.getByRole(
        "link",
        {
          name:
            /Wishlist/,
        },
      ),
    ).toBeVisible();

    await expect(
      primaryNavigation.getByRole(
        "link",
        {
          name:
            /Cart/,
        },
      ),
    ).toBeVisible();
  },
);

test(
  "assistant supports keyboard close and returns focus",
  async ({ page }) => {
    await page.goto("/");

    const trigger =
      page.getByRole(
        "button",
        {
          name:
            "AI Shopping Assistant",
        },
      );

    await trigger.click();

    const dialog =
      page.getByRole(
        "dialog",
        {
          name:
            "AI Shopping Assistant",
        },
      );

    await expect(
      dialog,
    ).toBeVisible();

    await page.keyboard.press(
      "Escape",
    );

    await expect(
      dialog,
    ).toHaveCount(0);

    await expect(
      trigger,
    ).toBeFocused();
  },
);

test(
  "homepage remains usable at mobile width",
  async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    await page.goto("/");

    await expect(
      page.getByRole(
        "heading",
        {
          level: 1,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "search",
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "button",
        {
          name:
            "AI Shopping Assistant",
        },
      ),
    ).toBeVisible();
  },
);
