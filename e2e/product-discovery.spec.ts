import {
  expect,
  test,
  type Page,
} from "@playwright/test";

const categories = [
  {
    slug: "beauty",
    name: "Beauty",
    url: "https://dummyjson.com/products/category/beauty",
  },
  {
    slug: "mens-shoes",
    name: "Mens Shoes",
    url: "https://dummyjson.com/products/category/mens-shoes",
  },
];

function createProduct(
  id: number,
  title: string,
  options: {
    category: string;
    price: number;
    rating: number;
    stock?: number;
    discountPercentage?: number;
    brand?: string;
  },
) {
  return {
    id,
    title,
    description: `${title} description`,
    category: options.category,
    price: options.price,
    discountPercentage:
      options.discountPercentage ?? 10,
    rating: options.rating,
    stock: options.stock ?? 20,
    tags: [options.category],
    brand: options.brand ?? "Test Brand",
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation: "1 year warranty",
    shippingInformation: "Ships in 3 days",
    availabilityStatus:
      (options.stock ?? 20) > 0
        ? "In Stock"
        : "Out of Stock",
    reviews: [],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt:
        id === 2
          ? "2026-10-01T00:00:00.000Z"
          : "2026-01-01T00:00:00.000Z",
      updatedAt:
        "2026-10-01T00:00:00.000Z",
      barcode: String(id),
      qrCode:
        "https://example.com/qr.png",
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
    "Budget Running Shoes",
    {
      category: "mens-shoes",
      price: 30,
      rating: 4.2,
      brand: "Stride",
    },
  ),
  createProduct(
    2,
    "Premium Running Shoes",
    {
      category: "mens-shoes",
      price: 50,
      rating: 4.8,
      brand: "Stride",
    },
  ),
  createProduct(
    3,
    "Luxury Running Shoes",
    {
      category: "mens-shoes",
      price: 80,
      rating: 4.9,
      brand: "Peak",
    },
  ),
  createProduct(
    4,
    "Low Rated Shoes",
    {
      category: "mens-shoes",
      price: 35,
      rating: 3.2,
      brand: "Basic",
    },
  ),
  createProduct(
    5,
    "Beauty Product",
    {
      category: "beauty",
      price: 20,
      rating: 4.6,
      brand: "Glow",
    },
  ),
];

async function mockProductApi(
  page: Page,
) {
  await page.route(
    /^https:\/\/dummyjson\.com\/products(?:\/.*)?(?:\?.*)?$/,
    async (route) => {
      const url = new URL(
        route.request().url(),
      );

      if (
        url.pathname ===
        "/products/categories"
      ) {
        await route.fulfill({
          json: categories,
        });
        return;
      }

      if (
        url.pathname ===
        "/products/search"
      ) {
        const query =
          url.searchParams
            .get("q")
            ?.toLowerCase() ?? "";

        const matches =
          products.filter((product) =>
            product.title
              .toLowerCase()
              .includes(query),
          );

        await route.fulfill({
          json: {
            products: matches,
            total: matches.length,
            skip: 0,
            limit: matches.length,
          },
        });
        return;
      }

      const categoryMatch =
        url.pathname.match(
          /^\/products\/category\/(.+)$/,
        );

      if (categoryMatch) {
        const category =
          decodeURIComponent(
            categoryMatch[1],
          );

        const matches =
          products.filter(
            (product) =>
              product.category ===
              category,
          );

        await route.fulfill({
          json: {
            products: matches,
            total: matches.length,
            skip: 0,
            limit: matches.length,
          },
        });
        return;
      }

      if (
        url.pathname === "/products"
      ) {
        await route.fulfill({
          json: {
            products,
            total: products.length,
            skip: 0,
            limit: products.length,
          },
        });
        return;
      }

      await route.fallback();
    },
  );
}

test.beforeEach(async ({ page }) => {
  await mockProductApi(page);
});

test("combined filters and sort update results and URL", async ({
  page,
}) => {
  await page.goto("/products");

  await expect(
    page.getByText("5 products found"),
  ).toBeVisible();

  await page.getByRole(
    "button",
    {
      name: "Mens Shoes",
    },
  ).click();

  await expect(page).toHaveURL(
    /category=mens-shoes/,
  );

  await expect(
    page.getByText("4 products found"),
  ).toBeVisible();

  await page
    .getByLabel(/^Minimum \(₹\)$/)
    .fill("2000");

  await expect(page).toHaveURL(
    /minPrice=2000/,
  );

  await page
    .getByLabel(/^Maximum \(₹\)$/)
    .fill("5000");

  await expect(page).toHaveURL(
    /maxPrice=5000/,
  );

  await page
    .getByLabel("Minimum rating")
    .selectOption("4");

  await expect(page).toHaveURL(
    /minRating=4/,
  );

  await page
    .getByRole("combobox", {
      name: "Sort products",
    })
    .selectOption("price-asc");

  await expect(page).toHaveURL(
    /sortBy=price/,
  );

  await expect(
    page.getByText("2 products found"),
  ).toBeVisible();

  const productHeadings =
    page.locator(
      '[aria-label="Product results"] h2',
    );

  await expect(
    productHeadings.nth(0),
  ).toHaveText(
    "Budget Running Shoes",
  );

  await expect(
    productHeadings.nth(1),
  ).toHaveText(
    "Premium Running Shoes",
  );

  await expect(
    page.getByLabel("Active filters"),
  ).toContainText("₹2,000");

  await expect(
    page.getByLabel("Active filters"),
  ).toContainText("₹5,000");

  await expect(page).toHaveURL(
    /category=mens-shoes/,
  );

  await expect(page).toHaveURL(
    /minPrice=2000/,
  );

  await expect(page).toHaveURL(
    /maxPrice=5000/,
  );

  await expect(page).toHaveURL(
    /minRating=4/,
  );

  await expect(page).toHaveURL(
    /sortBy=price/,
  );
});

test("no-result filters show clear filters recovery", async ({
  page,
}) => {
  await page.goto("/products");

  await expect(
    page.getByText("5 products found"),
  ).toBeVisible();

  await page
    .getByLabel(/^Minimum \(₹\)$/)
    .fill("99999");

  await expect(page).toHaveURL(
    /minPrice=99999/,
  );

  await expect(
    page.getByRole("heading", {
      name: "No products match these filters",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", {
      name: "Clear Filters",
      exact: true,
    }),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "Clear Filters",
      exact: true,
    })
    .click();

  await expect(
    page.getByText(
      "5 products found",
    ),
  ).toBeVisible();

  await expect(page).not.toHaveURL(
    /minPrice=/,
  );
});

test("debounced search updates the URL and results", async ({
  page,
}) => {
  await page.goto("/products");

  const search =
    page.getByRole("searchbox", {
      name: "Search products",
    });

  await search.fill("premium");

  await expect(page).not.toHaveURL(
    /q=premium/,
    {
      timeout: 200,
    },
  );

  await expect(page).toHaveURL(
    /q=premium/,
    {
      timeout: 1500,
    },
  );

  await expect(
    page.getByText(
      "1 products found",
    ),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Premium Running Shoes",
    }),
  ).toBeVisible();
});
