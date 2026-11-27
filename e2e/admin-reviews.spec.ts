import {
  expect,
  test,
  type Page,
} from "@playwright/test";

function product(
  id: number,
  title: string,
  stock = 10,
) {
  return {
    id,
    title,
    description:
      `${title} description`,
    category:
      "mobile-accessories",
    price: 40 + id,
    discountPercentage: 10,
    rating:
      id === 1
        ? 4.6
        : 4.2,
    stock,
    tags: [
      "headphones",
      "audio",
    ],
    brand: "Demo Brand",
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
      "Ships soon",
    availabilityStatus:
      stock > 0
        ? "In Stock"
        : "Out of Stock",
    reviews: [
      {
        rating: 4,
        comment:
          "A useful existing product review.",
        date:
          "2026-10-01T00:00:00.000Z",
        reviewerName:
          "Existing Reviewer",
        reviewerEmail:
          "reviewer@example.com",
      },
    ],
    returnPolicy:
      "30 day return",
    minimumOrderQuantity: 1,
    meta: {
      createdAt:
        "2026-01-01T00:00:00.000Z",
      updatedAt:
        "2026-10-01T00:00:00.000Z",
      barcode:
        `${id}`,
      qrCode:
        "https://example.com/qr",
    },
    images: [
      "/file.svg",
    ],
    thumbnail:
      "/file.svg",
  };
}

const products = [
  product(
    1,
    "Demo Headphones",
    3,
  ),
  product(
    2,
    "Backup Headphones",
    12,
  ),
];

async function mockProducts(
  page: Page,
) {
  await page.route(
    "https://dummyjson.com/**",
    async (route) => {
      const url =
        new URL(
          route.request().url(),
        );

      const detail =
        url.pathname.match(
          /^\/products\/(\d+)$/,
        );

      if (detail) {
        const found =
          products.find(
            (item) =>
              item.id ===
              Number(
                detail[1],
              ),
          );

        if (found) {
          await route.fulfill({
            status: 200,
            contentType:
              "application/json",
            body: JSON.stringify(
              found,
            ),
          });

          return;
        }
      }

      if (
        url.pathname ===
        "/products"
      ) {
        await route.fulfill({
          status: 200,
          contentType:
            "application/json",
          body: JSON.stringify({
            products,
            total:
              products.length,
            skip: 0,
            limit:
              products.length,
          }),
        });

        return;
      }

      await route.continue();
    },
  );
}

async function loginAdmin(
  page: Page,
) {
  await page.goto("/login");

  await page
    .getByRole("button", {
      name: "Admin demo",
    })
    .click();

  await page
    .getByRole("button", {
      name: "Sign in",
    })
    .click();

  await expect(
    page,
  ).toHaveURL(/\/admin$/);
}

async function loginCustomer(
  page: Page,
) {
  await page.goto("/login");

  await page
    .getByRole("button", {
      name: "Customer demo",
    })
    .click();

  await page
    .getByRole("button", {
      name: "Sign in",
    })
    .click();

  await expect(
    page,
  ).toHaveURL(
    /\/dashboard$/,
  );
}

test(
  "admin catalogue writes are clearly local simulations",
  async ({ page }) => {
    await mockProducts(
      page,
    );

    await loginAdmin(
      page,
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Product management",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Local Analytics",
        {
          exact: true,
        },
      ),
    ).toBeVisible();

    await page
      .getByLabel(
        "New category",
      )
      .fill(
        "Gaming Gear",
      );

    await page
      .getByRole(
        "button",
        {
          name:
            "Add locally",
        },
      )
      .click();

    await expect(
      page
        .getByLabel(
          "Filter admin products by category",
        )
        .locator(
          'option[value="gaming-gear"]',
        ),
    ).toHaveCount(1);

    await page
      .getByLabel(
        "New product title",
      )
      .fill(
        "Local Gaming Headset",
      );

    await page
      .getByLabel(
        "New product category",
      )
      .fill(
        "Gaming Gear",
      );

    await page
      .getByLabel(
        "New product price",
      )
      .fill("2999");

    await page
      .getByLabel(
        "New product stock",
      )
      .fill("6");

    await page
      .getByRole(
        "button",
        {
          name:
            "Add product locally",
        },
      )
      .click();

    const localProduct =
      page
        .locator("article")
        .filter({
          has: page.getByRole(
            "button",
            {
              name:
                "Delete locally",
            },
          ),
        })
        .filter({
          hasText:
            "Local Gaming Headset",
        });

    await expect(
      localProduct,
    ).toBeVisible();

    await localProduct
      .getByRole(
        "button",
        {
          name:
            "Delete locally",
        },
      )
      .click();

    await expect(
      page.getByText(
        "Local Gaming Headset",
        {
          exact: true,
        },
      ),
    ).toHaveCount(0);
  },
);

test(
  "admin can inspect and locally advance an order",
  async ({ page }) => {
    await mockProducts(
      page,
    );

    await page.addInitScript(
      () => {
        localStorage.setItem(
          "shopsphere-orders",
          JSON.stringify({
            state: {
              orders: [
                {
                  id:
                    "SS-ADMIN-001",
                  createdAt:
                    "2026-11-27T10:00:00.000Z",
                  expectedDeliveryDate:
                    "2026-12-02T10:00:00.000Z",
                  status:
                    "Order Placed",
                  statusHistory: [
                    {
                      status:
                        "Order Placed",
                      timestamp:
                        "2026-11-27T10:00:00.000Z",
                    },
                  ],
                  items: [
                    {
                      id:
                        "1:default",
                      productId:
                        1,
                      title:
                        "Demo Headphones",
                      price:
                        3320,
                      thumbnail:
                        "/file.svg",
                      quantity:
                        1,
                      stock: 10,
                    },
                  ],
                  customer: {
                    name:
                      "Demo Customer",
                    email:
                      "customer@shopsphere.dev",
                    phone:
                      "9999999999",
                  },
                  address: {
                    line1:
                      "Demo Street",
                    line2: "",
                    city:
                      "Ludhiana",
                    state:
                      "Punjab",
                    pinCode:
                      "141001",
                  },
                  deliveryMethod: {
                    id:
                      "standard",
                    name:
                      "Standard",
                    cost: 0,
                    eta:
                      "4–6 days",
                  },
                  paymentMethod:
                    "mock-cod",
                  totals: {
                    subtotal:
                      3320,
                    discount: 0,
                    shipping: 0,
                    tax: 166,
                    total: 3486,
                  },
                },
              ],
            },
            version: 0,
          }),
        );
      },
    );

    await loginAdmin(
      page,
    );

    const order =
      page
        .locator("article")
        .filter({
          has: page.getByRole(
            "button",
            {
              name:
                "Advance status locally",
            },
          ),
        })
        .filter({
          hasText:
            "SS-ADMIN-001",
        });

    await expect(
      order,
    ).toContainText(
      "Order Placed",
    );

    await order
      .getByRole(
        "button",
        {
          name:
            "View details",
        },
      )
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            /Order detail · SS-ADMIN-001/,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        /Demo Headphones × 1/,
      ),
    ).toBeVisible();

    await order
      .getByRole(
        "button",
        {
          name:
            "Advance status locally",
        },
      )
      .click();

    await expect(
      order,
    ).toContainText(
      "Confirmed",
    );
  },
);

test(
  "customer submits a verified review, votes, and manages it from dashboard",
  async ({ page }) => {
    await mockProducts(
      page,
    );

    await page.addInitScript(
      () => {
        localStorage.setItem(
          "shopsphere-orders",
          JSON.stringify({
            state: {
              orders: [
                {
                  id:
                    "SS-REVIEW-001",
                  createdAt:
                    "2026-11-20T10:00:00.000Z",
                  expectedDeliveryDate:
                    "2026-11-25T10:00:00.000Z",
                  status:
                    "Delivered",
                  statusHistory: [],
                  items: [
                    {
                      id:
                        "1:default",
                      productId:
                        1,
                      title:
                        "Demo Headphones",
                      price:
                        3320,
                      thumbnail:
                        "/file.svg",
                      quantity:
                        1,
                      stock: 10,
                    },
                  ],
                  customer: {
                    name:
                      "Demo Customer",
                    email:
                      "customer@shopsphere.dev",
                    phone:
                      "9999999999",
                  },
                  address: {
                    line1:
                      "Demo Street",
                    line2: "",
                    city:
                      "Ludhiana",
                    state:
                      "Punjab",
                    pinCode:
                      "141001",
                  },
                  deliveryMethod: {
                    id:
                      "standard",
                    name:
                      "Standard",
                    cost: 0,
                    eta:
                      "4–6 days",
                  },
                  paymentMethod:
                    "mock-cod",
                  totals: {
                    subtotal:
                      3320,
                    discount: 0,
                    shipping: 0,
                    tax: 166,
                    total: 3486,
                  },
                },
              ],
            },
            version: 0,
          }),
        );
      },
    );

    await loginCustomer(
      page,
    );

    await page.goto(
      "/products/1",
    );

    await expect(
      page.getByText(
        "✓ Verified Purchase",
        {
          exact: true,
        },
      ).first(),
    ).toBeVisible();

    const reviewText =
      "Excellent headphones for daily listening and long work sessions.";

    await page
      .getByRole(
        "textbox",
        {
          name: "Review",
          exact: true,
        },
      )
      .fill(
        reviewText,
      );

    await page
      .getByRole(
        "button",
        {
          name:
            "Submit review",
        },
      )
      .click();

    const reviewArticle =
      page
        .locator(
          "article",
        )
        .filter({
          hasText:
            reviewText,
        });

    await expect(
      reviewArticle,
    ).toBeVisible();

    await expect(
      reviewArticle,
    ).toContainText(
      "Verified Purchase",
    );

    await reviewArticle
      .getByRole(
        "button",
        {
          name:
            "Helpful (0)",
          exact: true,
        },
      )
      .click();

    await expect(
      reviewArticle.getByRole(
        "button",
        {
          name:
            "Helpful (1)",
          exact: true,
        },
      ),
    ).toBeVisible();

    await page.goto(
      "/dashboard",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Your reviews",
        },
      ),
    ).toBeVisible();

    const dashboardReview =
      page.getByRole(
        "form",
        {
          name:
            "Review for product 1",
        },
      );

    await expect(
      dashboardReview,
    ).toBeVisible();

    const updatedText =
      "Updated review: excellent sound and comfortable fit for everyday use.";

    await dashboardReview
      .getByLabel(
        "Review text for product 1",
      )
      .fill(
        updatedText,
      );

    await dashboardReview
      .getByRole(
        "button",
        {
          name:
            "Update review",
        },
      )
      .click();

    await expect(
      page.getByRole(
        "status",
      ).filter({
        hasText:
          "Review updated locally.",
      }),
    ).toBeVisible();

    await page.goto(
      "/products/1",
    );

    await expect(
      page.getByText(
        updatedText,
        {
          exact: true,
        },
      ),
    ).toBeVisible();
  },
);
