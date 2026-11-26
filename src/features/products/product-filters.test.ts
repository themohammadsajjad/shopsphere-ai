import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
  ProductFilters,
} from "@/types/product";

import {
  countActiveProductFilters,
  filterProducts,
  normalizeProductFilters,
} from "./product-filters";

function createProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: 1,
    title: "Test Product",
    description: "Test description",
    category: "beauty",
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 10,
    tags: ["test"],
    brand: "Acme",
    sku: "TEST-1",
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
      barcode: "123",
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

describe("normalizeProductFilters", () => {
  it("swaps an invalid price range", () => {
    expect(
      normalizeProductFilters(
        createFilters({
          minPrice: 500,
          maxPrice: 100,
        }),
      ),
    ).toMatchObject({
      minPrice: 100,
      maxPrice: 500,
    });
  });

  it("removes duplicate brands and categories", () => {
    const filters = normalizeProductFilters(
      createFilters({
        brands: ["Acme", "Acme"],
        categories: ["beauty", "beauty"],
      }),
    );

    expect(filters.brands).toEqual(["Acme"]);
    expect(filters.categories).toEqual([
      "beauty",
    ]);
  });
});

describe("filterProducts", () => {
  const products = [
    createProduct({
      id: 1,
      title: "Beauty Sale",
      category: "beauty",
      brand: "Acme",
      price: 100,
      rating: 4.5,
      stock: 10,
      discountPercentage: 15,
    }),
    createProduct({
      id: 2,
      title: "Furniture",
      category: "furniture",
      brand: "HomeCo",
      price: 300,
      rating: 3.5,
      stock: 0,
      discountPercentage: 0,
    }),
    createProduct({
      id: 3,
      title: "Premium Beauty",
      category: "beauty",
      brand: "Luxury",
      price: 600,
      rating: 4.8,
      stock: 4,
      discountPercentage: 5,
    }),
  ];

  it("filters by price range", () => {
    const result = filterProducts(
      products,
      createFilters({
        minPrice: 150,
        maxPrice: 500,
      }),
    );

    expect(result.map((product) => product.id)).toEqual([
      2,
    ]);
  });

  it("filters by minimum rating", () => {
    const result = filterProducts(
      products,
      createFilters({
        minRating: 4,
      }),
    );

    expect(result.map((product) => product.id)).toEqual([
      1,
      3,
    ]);
  });

  it("filters in-stock products", () => {
    const result = filterProducts(
      products,
      createFilters({
        availability: "in-stock",
      }),
    );

    expect(result.map((product) => product.id)).toEqual([
      1,
      3,
    ]);
  });

  it("filters out-of-stock products", () => {
    const result = filterProducts(
      products,
      createFilters({
        availability: "out-of-stock",
      }),
    );

    expect(result.map((product) => product.id)).toEqual([
      2,
    ]);
  });

  it("filters products that are on sale", () => {
    const result = filterProducts(
      products,
      createFilters({
        onSale: true,
      }),
    );

    expect(result.map((product) => product.id)).toEqual([
      1,
      3,
    ]);
  });

  it("supports brand multi-select", () => {
    const result = filterProducts(
      products,
      createFilters({
        brands: ["Acme", "Luxury"],
      }),
    );

    expect(result.map((product) => product.id)).toEqual([
      1,
      3,
    ]);
  });

  it("supports category multi-select", () => {
    const result = filterProducts(
      products,
      createFilters({
        categories: ["beauty"],
      }),
    );

    expect(result.map((product) => product.id)).toEqual([
      1,
      3,
    ]);
  });

  it("combines multiple filters", () => {
    const result = filterProducts(
      products,
      createFilters({
        minPrice: 50,
        maxPrice: 200,
        minRating: 4,
        availability: "in-stock",
        onSale: true,
        brands: ["Acme"],
        categories: ["beauty"],
      }),
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});

describe("countActiveProductFilters", () => {
  it("counts each active filter group", () => {
    expect(
      countActiveProductFilters(
        createFilters({
          minPrice: 100,
          maxPrice: 500,
          minRating: 4,
          availability: "in-stock",
          onSale: true,
          brands: ["Acme"],
          categories: ["beauty"],
        }),
      ),
    ).toBe(7);
  });

  it("returns zero for empty filters", () => {
    expect(
      countActiveProductFilters(
        createFilters(),
      ),
    ).toBe(0);
  });
});
