import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import type { Product } from "@/types/product";

import { ProductCard } from "./product-card";

function createProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description: "Test product description",
    category: "beauty",
    price: 9.99,
    discountPercentage: 12.5,
    rating: 4.5,
    stock: 99,
    tags: ["beauty"],
    brand: "Essence",
    sku: "BEA-ESS-001",
    weight: 4,
    dimensions: {
      width: 15,
      height: 10,
      depth: 5,
    },
    warrantyInformation: "1 month warranty",
    shippingInformation: "Ships in 3 days",
    availabilityStatus: "In Stock",
    reviews: [],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      barcode: "123456789",
      qrCode: "https://example.com/qr.png",
    },
    images: [
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
    ],
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    ...overrides,
  };
}

describe("ProductCard", () => {
  it("renders the product details", () => {
    render(
      <ProductCard
        product={createProduct()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Essence Mascara Lash Princess",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Beauty"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Essence"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("₹9.99"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("13% off"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Rated 4.5 out of 5"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("In Stock"),
    ).toBeInTheDocument();
  });

  it("formats multi-word category names", () => {
    render(
      <ProductCard
        product={createProduct({
          category: "mens-shirts",
        })}
      />,
    );

    expect(
      screen.getByText("Mens Shirts"),
    ).toBeInTheDocument();
  });

  it("shows a low-stock message", () => {
    render(
      <ProductCard
        product={createProduct({
          stock: 3,
        })}
      />,
    );

    expect(
      screen.getByText("Only 3 left"),
    ).toBeInTheDocument();
  });

  it("shows an out-of-stock message", () => {
    render(
      <ProductCard
        product={createProduct({
          stock: 0,
          availabilityStatus: "Out of Stock",
        })}
      />,
    );

    expect(
      screen.getByText("Out of stock"),
    ).toBeInTheDocument();
  });

  it("does not render a brand when none is provided", () => {
    render(
      <ProductCard
        product={createProduct({
          brand: undefined,
        })}
      />,
    );

    expect(
      screen.queryByText("Essence"),
    ).not.toBeInTheDocument();
  });

  it("does not render a discount badge for zero discount", () => {
    render(
      <ProductCard
        product={createProduct({
          discountPercentage: 0,
        })}
      />,
    );

    expect(
      screen.queryByText(/% off/i),
    ).not.toBeInTheDocument();
  });
});
