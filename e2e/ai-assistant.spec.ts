import {
  expect,
  test,
  type Page,
} from "@playwright/test";

function makeProduct(
  id: number,
  title: string,
  category: string,
  price: number,
  rating: number,
  tags: string[],
) {
  return {
    id,
    title,
    description:
      `${title} product description`,
    category,
    price,
    discountPercentage: 10,
    rating,
    stock: 20,
    tags,
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
      "Ships in 2 days",
    availabilityStatus:
      "In Stock",
    reviews: [],
    returnPolicy:
      "30 day return",
    minimumOrderQuantity: 1,
    meta: {
      createdAt:
        "2026-01-01T00:00:00.000Z",
      updatedAt:
        "2026-01-01T00:00:00.000Z",
      barcode: String(id),
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
  makeProduct(
    1,
    "Everyday Headphones",
    "mobile-accessories",
    40,
    4.2,
    [
      "headphones",
      "audio",
    ],
  ),
  makeProduct(
    2,
    "Studio Headphones",
    "mobile-accessories",
    48,
    4.8,
    [
      "headphones",
      "audio",
      "studio",
    ],
  ),
  makeProduct(
    3,
    "Gaming Headphones",
    "mobile-accessories",
    55,
    4.9,
    [
      "headphones",
      "gaming",
      "audio",
    ],
  ),
  makeProduct(
    4,
    "Premium Headphones",
    "mobile-accessories",
    70,
    4.9,
    [
      "headphones",
      "premium",
      "audio",
    ],
  ),
  makeProduct(
    5,
    "Demo Smartphone",
    "smartphones",
    300,
    4.7,
    [
      "smartphone",
      "mobile",
      "tech",
    ],
  ),
  makeProduct(
    6,
    "Demo Laptop",
    "laptops",
    600,
    4.6,
    [
      "laptop",
      "computer",
    ],
  ),
];

async function openAssistant(
  page: Page,
) {
  await page.goto("/");

  await page
    .getByRole("button", {
      name:
        "AI Shopping Assistant",
      exact: true,
    })
    .click();

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

  return dialog;
}

async function sendMessage(
  page: Page,
  message: string,
) {
  await page
    .getByLabel(
      "Shopping request",
    )
    .fill(message);

  await page
    .getByRole("button", {
      name: "Send",
      exact: true,
    })
    .click();
}

test.beforeEach(
  async ({ page }) => {
    await page.route(
      "https://dummyjson.com/**",
      async (route) => {
        const url =
          new URL(
            route.request().url(),
          );

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
              limit: 200,
            }),
          });

          return;
        }

        const productMatch =
          url.pathname.match(
            /^\/products\/(\d+)$/,
          );

        if (
          productMatch
        ) {
          const product =
            products.find(
              (item) =>
                item.id ===
                Number(
                  productMatch[
                    1
                  ],
                ),
            );

          if (product) {
            await route.fulfill({
              status: 200,
              contentType:
                "application/json",
              body: JSON.stringify(
                product,
              ),
            });

            return;
          }
        }

        await route.continue();
      },
    );
  },
);

test(
  "MOD-AI-001 parses category and price and returns inline products",
  async ({ page }) => {
    const dialog =
      await openAssistant(
        page,
      );

    await expect(
      dialog.getByText(
        /Rule-Based \/ Mock AI/i,
      ),
    ).toBeVisible();

    await sendMessage(
      page,
      "Show me headphones under 5000",
    );

    const response =
      dialog
        .locator(
          'article[data-role="assistant"]',
        )
        .last();

    await expect(
      response,
    ).toContainText(
      "category = headphones",
    );

    await expect(
      response,
    ).toContainText(
      /max price = ₹5,000/,
    );

    await expect(
      response.getByRole(
        "link",
        {
          name:
            /Gaming Headphones/,
        },
      ),
    ).toBeVisible();

    await expect(
      response.locator(
        'a[href^="/products/"]',
      ),
    ).not.toHaveCount(0);
  },
);

test(
  "MOD-AI-002 keeps context while improving rating",
  async ({ page }) => {
    const dialog =
      await openAssistant(
        page,
      );

    await sendMessage(
      page,
      "Show me headphones under 5000",
    );

    await expect(
      dialog
        .locator(
          'article[data-role="assistant"]',
        )
        .last(),
    ).toContainText(
      "category = headphones",
    );

    await sendMessage(
      page,
      "show me something with better ratings",
    );

    const refined =
      dialog
        .locator(
          'article[data-role="assistant"]',
        )
        .last();

    await expect(
      refined,
    ).toContainText(
      "category = headphones",
    );

    await expect(
      refined,
    ).toContainText(
      /max price = ₹5,000/,
    );

    await expect(
      refined,
    ).toContainText(
      "minimum rating = 4.5",
    );

    await expect(
      refined.getByText(
        "Gaming Headphones",
        {
          exact: true,
        },
      ),
    ).toBeVisible();
  },
);

test(
  "MOD-AI-003 gives clarification and suggested prompts",
  async ({ page }) => {
    const dialog =
      await openAssistant(
        page,
      );

    await sendMessage(
      page,
      "hmm not sure",
    );

    const response =
      dialog
        .locator(
          'article[data-role="assistant"]',
        )
        .last();

    await expect(
      response,
    ).toContainText(
      /could not confidently understand/i,
    );

    await expect(
      response.getByRole(
        "button",
        {
          name:
            "Show me headphones under 5000",
        },
      ),
    ).toBeVisible();

    await expect(
      response.getByRole(
        "button",
        {
          name:
            "Show me smartphones with good ratings",
        },
      ),
    ).toBeVisible();

    await expect(
      response.getByRole(
        "button",
        {
          name:
            "Show me shoes under 4000",
        },
      ),
    ).toBeVisible();

    await expect(
      response.locator(
        'a[href^="/products/"]',
      ),
    ).toHaveCount(0);
  },
);

test(
  "similarity refinement reuses the recommendation engine",
  async ({ page }) => {
    const dialog =
      await openAssistant(
        page,
      );

    await sendMessage(
      page,
      "Show me headphones under 5000",
    );

    await expect(
      dialog
        .locator(
          'article[data-role="assistant"]',
        )
        .last(),
    ).toContainText(
      "category = headphones",
    );

    await sendMessage(
      page,
      "show me more like the second one",
    );

    const response =
      dialog
        .locator(
          'article[data-role="assistant"]',
        )
        .last();

    await expect(
      response,
    ).toContainText(
      /similar to Studio Headphones/i,
    );

    await expect(
      response,
    ).toContainText(
      /Similar Products recommendation strategy/i,
    );

    await expect(
      response.locator(
        'a[href^="/products/"]',
      ),
    ).not.toHaveCount(0);
  },
);
