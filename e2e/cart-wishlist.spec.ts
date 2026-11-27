import {
  expect,
  test,
} from "@playwright/test";

type ProductInput = {
  id: number;
  title: string;
  price?: number;
  stock: number;
};

function createProduct({
  id,
  title,
  price = 40,
  stock,
}: ProductInput) {
  return {
    id,
    title,
    description:
      "A test product for cart and wishlist flows.",
    category: "beauty",
    price,
    discountPercentage: 0,
    rating: 4.5,
    stock,
    tags: ["test"],
    brand: "ShopSphere",
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation:
      "1 year warranty",
    shippingInformation:
      "Ships in 3 days",
    availabilityStatus:
      stock > 0
        ? "In Stock"
        : "Out of Stock",
    reviews: [],
    returnPolicy:
      "30 days return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt:
        "2026-01-01T00:00:00.000Z",
      updatedAt:
        "2026-10-01T00:00:00.000Z",
      barcode: String(id),
      qrCode:
        "https://example.com/qr",
    },
    images: ["/file.svg"],
    thumbnail: "/file.svg",
  };
}

test(
  "cart clamps quantity to live stock and supports coupons and save for later",
  async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "shopsphere-cart",
        JSON.stringify({
          state: {
            items: [
              {
                id: "1:default",
                productId: 1,
                title:
                  "Running Shoes",
                price: 3320,
                thumbnail:
                  "/file.svg",
                quantity: 5,
                stock: 5,
              },
            ],
            savedItems: [],
          },
          version: 0,
        }),
      );
    });

    await page.route(
      "https://dummyjson.com/products/1",
      async (route) => {
        await route.fulfill({
          json: createProduct({
            id: 1,
            title:
              "Running Shoes",
            stock: 3,
          }),
        });
      },
    );

    await page.goto("/cart");

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Shopping cart",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("status", {
        name: "Quantity for Running Shoes",
        exact: true,
      }),
    ).toHaveText("3");

    await page
      .getByRole("button", {
        name:
          "Increase quantity for Running Shoes",
      })
      .click();

    await expect(
      page.getByText(
        "Only 3 units are available. Quantity has been limited to available stock.",
        {
          exact: true,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("status", {
        name: "Quantity for Running Shoes",
        exact: true,
      }),
    ).toHaveText("3");

    await page
      .getByLabel("Coupon code")
      .fill("SHOP10");

    await page
      .getByRole("button", {
        name: "Apply",
      })
      .click();

    await expect(
      page.getByText(
        "SHOP10 applied",
        {
          exact: true,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name:
          "Proceed to checkout",
      }),
    ).toHaveAttribute(
      "href",
      "/checkout",
    );

    await page
      .getByRole("button", {
        name:
          "Save for later",
      })
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Saved for later",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Move to cart",
      }),
    ).toBeVisible();
  },
);

test(
  "out-of-stock wishlist item remains saved and cannot move to cart",
  async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "shopsphere-wishlist",
        JSON.stringify({
          state: {
            productIds: [2],
          },
          version: 0,
        }),
      );
    });

    await page.route(
      "https://dummyjson.com/products/2",
      async (route) => {
        await route.fulfill({
          json: createProduct({
            id: 2,
            title:
              "Saved Headphones",
            stock: 0,
          }),
        });
      },
    );

    await page.goto(
      "/wishlist",
    );

    await expect(
      page.getByText(
        "Saved Headphones",
        {
          exact: true,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Out of stock",
        {
          exact: true,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name:
          "Move to Cart",
      }),
    ).toBeDisabled();

    const savedIds =
      await page.evaluate(
        () => {
          const raw =
            localStorage.getItem(
              "shopsphere-wishlist",
            );

          if (!raw) {
            return [];
          }

          return JSON.parse(raw)
            .state.productIds;
        },
      );

    expect(savedIds).toEqual([
      2,
    ]);
  },
);

test(
  "in-stock wishlist item moves into the cart",
  async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "shopsphere-wishlist",
        JSON.stringify({
          state: {
            productIds: [3],
          },
          version: 0,
        }),
      );

      localStorage.removeItem(
        "shopsphere-cart",
      );
    });

    await page.route(
      "https://dummyjson.com/products/3",
      async (route) => {
        await route.fulfill({
          json: createProduct({
            id: 3,
            title:
              "Wireless Speaker",
            stock: 5,
          }),
        });
      },
    );

    await page.goto(
      "/wishlist",
    );

    await page
      .getByRole("button", {
        name:
          "Move to Cart",
      })
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Your wishlist is empty",
        },
      ),
    ).toBeVisible();

    const cart =
      await page.evaluate(
        () => {
          const raw =
            localStorage.getItem(
              "shopsphere-cart",
            );

          return raw
            ? JSON.parse(raw)
            : null;
        },
      );

    expect(
      cart.state.items[0]
        .productId,
    ).toBe(3);
  },
);
