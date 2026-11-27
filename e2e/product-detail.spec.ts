import {
  expect,
  test,
} from "@playwright/test";

const product = {
  id: 1,
  title: "Stride Runner Pro",
  description:
    "Lightweight running shoes for everyday training.",
  category: "mens-shoes",
  price: 40,
  discountPercentage: 20,
  rating: 4.6,
  stock: 12,
  tags: [
    "running",
    "shoes",
  ],
  brand: "Stride",
  sku: "STRIDE-001",
  weight: 1,
  dimensions: {
    width: 30,
    height: 12,
    depth: 20,
  },
  warrantyInformation:
    "1 year warranty",
  shippingInformation:
    "Ships in 3 days",
  availabilityStatus:
    "In Stock",
  reviews: [
    {
      rating: 5,
      comment:
        "Comfortable for daily runs.",
      date:
        "2026-10-10T00:00:00.000Z",
      reviewerName:
        "Demo Customer",
      reviewerEmail:
        "demo@example.com",
    },
  ],
  returnPolicy:
    "30 days return policy",
  minimumOrderQuantity: 1,
  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",
    updatedAt:
      "2026-10-01T00:00:00.000Z",
    barcode: "123456",
    qrCode:
      "https://example.com/qr",
  },
  images: [
    "/file.svg",
    "/globe.svg",
  ],
  thumbnail: "/file.svg",
};

test(
  "product detail supports stock-aware purchase flow",
  async ({ page }) => {
    await page.route(
      "https://dummyjson.com/products/1",
      async (route) => {
        await route.fulfill({
          json: product,
        });
      },
    );

    await page.goto(
      "/products/1",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name: "Stride Runner Pro",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        /₹3,320/,
      ).first(),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "button",
        {
          name: "8 - Out of stock",
        },
      ),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "8 - Out of stock",
      })
      .click();

    await expect(
      page.getByRole(
        "button",
        {
          name: "Variant unavailable",
        },
      ),
    ).toBeDisabled();

    await expect(
      page.getByText(
        /selected variant is out of stock/i,
      ),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: /7 - .* in stock/i,
      })
      .click();

    await expect(
      page.getByRole(
        "button",
        {
          name: "Add to Cart",
        },
      ),
    ).toBeEnabled();

    await page
      .getByRole("button", {
        name: "Add to Cart",
      })
      .click();

    await expect(
      page.getByRole(
        "button",
        {
          name: "Added to cart",
        },
      ),
    ).toBeVisible();

    await page
      .getByRole("tab", {
        name: "Specifications",
      })
      .click();

    await expect(
      page.getByText(
        "STRIDE-001",
      ),
    ).toBeVisible();

    await page
      .getByLabel(
        "Delivery PIN code",
      )
      .fill("144411");

    await page
      .getByRole("button", {
        name: "Check delivery",
      })
      .click();

    await expect(
      page.getByText(
        "Estimated delivery in 3–5 business days.",
        {
          exact: true,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "region",
        {
          name: "Related Products",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "region",
        {
          name: "Similar Products",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "region",
        {
          name:
            "Frequently Bought Together",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "region",
        {
          name:
            "Recommended For You",
        },
      ),
    ).toBeVisible();
  },
);

test(
  "removed product shows a useful unavailable state",
  async ({ page }) => {
    await page.route(
      "https://dummyjson.com/products/999",
      async (route) => {
        await route.fulfill({
          status: 404,
          json: {
            message:
              "Product not found",
          },
        });
      },
    );

    await page.goto(
      "/products/999",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Product no longer available",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "link",
        {
          name:
            "Browse products",
        },
      ),
    ).toHaveAttribute(
      "href",
      "/products",
    );
  },
);
