import {
  describe,
  expect,
  it,
} from "vitest";

import type { Product } from "@/types/product";

import { getProductVariants } from "./product-variants";

function createProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: 1,
    title: "Running Shoes",
    description: "Test",
    category: "mens-shoes",
    price: 3000,
    discountPercentage: 10,
    rating: 4.5,
    stock: 12,
    tags: ["shoes"],
    brand: "Stride",
    sku: "SHOE-1",
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation: "1 year",
    shippingInformation: "Ships in 3 days",
    availabilityStatus: "In Stock",
    reviews: [],
    returnPolicy: "30 days",
    minimumOrderQuantity: 1,
    meta: {
      createdAt:
        "2026-01-01T00:00:00.000Z",
      updatedAt:
        "2026-01-01T00:00:00.000Z",
      barcode: "1",
      qrCode: "https://example.com/qr",
    },
    images: [
      "https://example.com/image.webp",
    ],
    thumbnail:
      "https://example.com/image.webp",
    ...overrides,
  };
}

describe("product variants", () => {
  it("creates shoe size variants", () => {
    const variants =
      getProductVariants(
        createProduct(),
      );

    expect(
      variants.map(
        (variant) =>
          variant.label,
      ),
    ).toEqual([
      "7",
      "8",
      "9",
      "10",
    ]);
  });

  it("includes an unavailable variant for stock behavior testing", () => {
    const variants =
      getProductVariants(
        createProduct(),
      );

    expect(
      variants.some(
        (variant) =>
          variant.stock === 0,
      ),
    ).toBe(true);

    expect(
      variants.some(
        (variant) =>
          variant.stock > 0,
      ),
    ).toBe(true);
  });

  it("does not create variants for unsupported categories", () => {
    expect(
      getProductVariants(
        createProduct({
          category: "beauty",
        }),
      ),
    ).toEqual([]);
  });
});
