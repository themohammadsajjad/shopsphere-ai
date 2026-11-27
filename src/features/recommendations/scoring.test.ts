import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getRecommendationScore,
  normalizedRating,
  priceSimilarity,
} from "./scoring";
import type { Product } from "@/types/product";

const base = {
  description: "Test",
  discountPercentage: 0,
  stock: 10,
  brand: "Brand",
  sku: "SKU",
  weight: 1,
  dimensions: {
    width: 1,
    height: 1,
    depth: 1,
  },
  warrantyInformation:
    "Warranty",
  shippingInformation:
    "Shipping",
  availabilityStatus:
    "In Stock",
  reviews: [],
  returnPolicy: "Return",
  minimumOrderQuantity: 1,
  meta: {
    createdAt:
      "2026-01-01T00:00:00.000Z",
    updatedAt:
      "2026-01-01T00:00:00.000Z",
    barcode: "1",
    qrCode: "qr",
  },
  images: ["/file.svg"],
  thumbnail: "/file.svg",
};

const seed: Product = {
  ...base,
  id: 1,
  title: "Running Shoe",
  category: "mens-shoes",
  price: 3000,
  rating: 4,
  tags: ["running"],
};

const close: Product = {
  ...base,
  id: 2,
  title: "Runner",
  category: "mens-shoes",
  price: 3200,
  rating: 5,
  tags: ["running"],
};

describe("recommendation scoring", () => {
  it("normalizes ratings", () => {
    expect(
      normalizedRating(
        close,
      ),
    ).toBe(1);
  });

  it("scores nearby prices higher", () => {
    expect(
      priceSimilarity(
        close,
        [seed],
      ),
    ).toBeGreaterThan(
      priceSimilarity(
        {
          ...close,
          price: 30000,
        },
        [seed],
      ),
    );
  });

  it("produces a normalized weighted score", () => {
    const score =
      getRecommendationScore(
        close,
        {
          recentlyViewed: [
            seed,
          ],
          searchHistory: [
            "running shoes",
          ],
          wishlist: [],
          cart: [],
          purchases: [],
        },
      );

    expect(
      score.total,
    ).toBeGreaterThan(0);

    expect(
      score.total,
    ).toBeLessThanOrEqual(1);
  });
});
