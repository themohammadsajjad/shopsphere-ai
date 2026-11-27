import {
  describe,
  expect,
  it,
} from "vitest";

import { runRecommendationStrategy } from "./mock-recommendation-engine";
import type { Product } from "@/types/product";
import type { RecommendationContext } from "@/types/recommendation";

function product(
  id: number,
  category: string,
  price: number,
  rating: number,
  tags: string[],
): Product {
  return {
    id,
    title: `Product ${id}`,
    description: "Test",
    category,
    price,
    discountPercentage:
      id % 3 === 0
        ? 15
        : 5,
    rating,
    stock: 10,
    tags,
    brand:
      id % 2 === 0
        ? "Alpha"
        : "Beta",
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation:
      "1 year",
    shippingInformation:
      "Ships soon",
    availabilityStatus:
      "In Stock",
    reviews: [],
    returnPolicy:
      "30 days",
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
    images: ["/file.svg"],
    thumbnail: "/file.svg",
  };
}

const shoes = product(
  1,
  "mens-shoes",
  3000,
  4.5,
  ["running", "sport"],
);

const shoesTwo = product(
  2,
  "mens-shoes",
  3200,
  4.7,
  ["running", "sport"],
);

const bag = product(
  3,
  "mens-bags",
  2800,
  4.3,
  ["running", "travel"],
);

const phone = product(
  4,
  "smartphones",
  25000,
  4.8,
  ["mobile", "tech"],
);

const headphones = product(
  5,
  "mobile-accessories",
  3500,
  4.6,
  ["audio", "tech"],
);

const watch = product(
  6,
  "mens-watches",
  5000,
  4.4,
  ["sport", "wearable"],
);

function context(): RecommendationContext {
  return {
    products: [
      shoes,
      shoesTwo,
      bag,
      phone,
      headphones,
      watch,
    ],
    seedProduct: shoes,
    signals: {
      recentlyViewed: [
        shoes,
      ],
      searchHistory: [
        "running shoes",
      ],
      wishlist: [
        shoesTwo,
      ],
      cart: [bag],
      purchases: [
        headphones,
      ],
    },
  };
}

describe("mock recommendation engine", () => {
  it("returns recent products in recent order", () => {
    const result =
      runRecommendationStrategy(
        "recently-viewed",
        context(),
      );

    expect(
      result.products[0].id,
    ).toBe(1);
  });

  it("excludes the seed from similar products", () => {
    const result =
      runRecommendationStrategy(
        "similar-products",
        context(),
      );

    expect(
      result.products.some(
        (item) =>
          item.id === 1,
      ),
    ).toBe(false);
  });

  it("uses the seed category for category recommendations", () => {
    const result =
      runRecommendationStrategy(
        "category-based",
        context(),
      );

    expect(
      result.products.every(
        (item) =>
          item.category ===
          "mens-shoes",
      ),
    ).toBe(true);
  });

  it("returns price-based products", () => {
    expect(
      runRecommendationStrategy(
        "price-based",
        context(),
      ).products.length,
    ).toBeGreaterThan(0);
  });

  it("does not recommend the wishlisted product back in wishlist strategy", () => {
    const result =
      runRecommendationStrategy(
        "wishlist-based",
        context(),
      );

    expect(
      result.products.some(
        (item) =>
          item.id === 2,
      ),
    ).toBe(false);
  });

  it("does not recommend cart items back in cart strategy", () => {
    const result =
      runRecommendationStrategy(
        "cart-based",
        context(),
      );

    expect(
      result.products.some(
        (item) =>
          item.id === 3,
      ),
    ).toBe(false);
  });

  it("creates frequently bought together candidates", () => {
    expect(
      runRecommendationStrategy(
        "frequently-bought-together",
        context(),
      ).products.length,
    ).toBeGreaterThan(0);
  });

  it("ranks trending products independently of personal history", () => {
    const result =
      runRecommendationStrategy(
        "trending",
        context(),
      );

    expect(
      result.title,
    ).toBe(
      "Trending Products",
    );
  });

  it("creates a personalized weighted blend", () => {
    const result =
      runRecommendationStrategy(
        "personalized",
        context(),
      );

    expect(
      result.title,
    ).toBe(
      "Recommended For You",
    );

    expect(
      result.products.length,
    ).toBeGreaterThan(0);
  });
});
