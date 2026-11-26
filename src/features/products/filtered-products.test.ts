import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
  ProductFilters,
} from "@/types/product";

import { getFilteredProductsPage } from "./filtered-products";

function createProduct(
  id: number,
  overrides: Partial<Product> = {},
): Product {
  return {
    id,
    title: `Product ${id}`,
    description: "Test",
    category: "beauty",
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 10,
    tags: ["test"],
    brand: "Acme",
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation: "Warranty",
    shippingInformation: "Shipping",
    availabilityStatus: "In Stock",
    reviews: [],
    returnPolicy: "30 days",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      barcode: String(id),
      qrCode: "https://example.com/qr.png",
    },
    images: ["https://example.com/product.png"],
    thumbnail: "https://example.com/product.png",
    ...overrides,
  };
}

function createFilters(
  overrides: Partial<ProductFilters> = {},
): ProductFilters {
  return {
    brands: [],
    categories: [],
    ...overrides,
  };
}

describe("getFilteredProductsPage", () => {
  it("filters the full candidate set before pagination", () => {
    const products = Array.from(
      { length: 20 },
      (_, index) =>
        createProduct(index + 1, {
          price: index + 1,
        }),
    );

    const result = getFilteredProductsPage({
      products,
      filters: createFilters({
        minPrice: 10,
      }),
      page: 1,
      limit: 5,
    });

    expect(result.total).toBe(11);
    expect(result.products).toHaveLength(5);
    expect(result.products[0].price).toBe(10);
  });

  it("returns the requested filtered page", () => {
    const products = Array.from(
      { length: 20 },
      (_, index) =>
        createProduct(index + 1, {
          category:
            index < 15
              ? "beauty"
              : "furniture",
        }),
    );

    const result = getFilteredProductsPage({
      products,
      filters: createFilters({
        categories: ["beauty"],
      }),
      page: 2,
      limit: 5,
    });

    expect(result.total).toBe(15);
    expect(
      result.products.map((product) => product.id),
    ).toEqual([6, 7, 8, 9, 10]);
  });

  it("normalizes invalid page and limit values", () => {
    const result = getFilteredProductsPage({
      products: [
        createProduct(1),
        createProduct(2),
      ],
      filters: createFilters(),
      page: 0,
      limit: 0,
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.products).toHaveLength(1);
    expect(result.total).toBe(2);
  });

  it("returns an empty page when the page is beyond filtered results", () => {
    const result = getFilteredProductsPage({
      products: [
        createProduct(1),
        createProduct(2),
      ],
      filters: createFilters(),
      page: 3,
      limit: 2,
    });

    expect(result.products).toEqual([]);
    expect(result.total).toBe(2);
  });
});
