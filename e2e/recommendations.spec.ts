import {
  expect,
  test,
} from "@playwright/test";

function createProduct(
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
      `${title} description`,
    category,
    price,
    discountPercentage: 10,
    rating,
    stock: 20,
    tags,
    brand: "Test Brand",
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
      barcode: `${id}`,
      qrCode:
        "https://example.com/qr",
    },
    images: [
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
    ],
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  };
}

const products = [
  createProduct(
    1,
    "Running Shoes",
    "mens-shoes",
    40,
    4.6,
    ["running", "sport"],
  ),
  createProduct(
    2,
    "Trail Shoes",
    "mens-shoes",
    45,
    4.7,
    ["running", "trail"],
  ),
  createProduct(
    3,
    "Running Backpack",
    "mens-bags",
    38,
    4.5,
    ["running", "travel"],
  ),
  createProduct(
    4,
    "Sports Watch",
    "mens-watches",
    60,
    4.8,
    ["sport", "wearable"],
  ),
  createProduct(
    5,
    "Wireless Headphones",
    "mobile-accessories",
    50,
    4.9,
    ["audio", "tech"],
  ),
];

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
          "/products/1"
        ) {
          await route.fulfill({
            status: 200,
            contentType:
              "application/json",
            body: JSON.stringify(
              products[0],
            ),
          });

          return;
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
              limit: 200,
            }),
          });

          return;
        }

        await route.continue();
      },
    );
  },
);

test(
  "first-time homepage shows trending and popular fallback",
  async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Trending Products",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Popular Right Now",
        },
      ),
    ).toBeVisible();
  },
);

test(
  "viewing a product creates recent and personalized recommendations",
  async ({ page }) => {
    await page.goto(
      "/products/1",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Running Shoes",
          level: 1,
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Similar Products",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Frequently Bought Together",
        },
      ),
    ).toBeVisible();

    await page.goto("/");

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Recently Viewed",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Recommended For You",
        },
      ),
    ).toBeVisible();
  },
);

test(
  "wishlist signal creates wishlist recommendations",
  async ({ page }) => {
    await page.addInitScript(
      () => {
        localStorage.setItem(
          "shopsphere-wishlist",
          JSON.stringify({
            state: {
              productIds: [1],
            },
            version: 0,
          }),
        );
      },
    );

    await page.goto(
      "/wishlist",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Because of Your Wishlist",
        },
      ),
    ).toBeVisible();
  },
);

test(
  "cart signal creates cart recommendations",
  async ({ page }) => {
    await page.addInitScript(
      () => {
        localStorage.setItem(
          "shopsphere-cart",
          JSON.stringify({
            state: {
              items: [
                {
                  id:
                    "1:default",
                  productId: 1,
                  title:
                    "Running Shoes",
                  price: 3320,
                  thumbnail:
                    "/file.svg",
                  quantity: 1,
                  stock: 10,
                },
              ],
              savedItems: [],
            },
            version: 0,
          }),
        );
      },
    );

    await page.goto("/cart");

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Complete Your Cart",
        },
      ),
    ).toBeVisible();
  },
);
