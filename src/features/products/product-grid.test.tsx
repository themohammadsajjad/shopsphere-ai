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

import { ProductGrid } from "./product-grid";

function createProduct(
  id: number,
  title: string,
): Product {
  return {
    id,
    title,
    description: "Test product",
    category: "beauty",
    price: 10,
    discountPercentage: 5,
    rating: 4.5,
    stock: 20,
    tags: ["test"],
    brand: "Test Brand",
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
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
      "https://cdn.dummyjson.com/product-images/test.webp",
    ],
    thumbnail:
      "https://cdn.dummyjson.com/product-images/test.webp",
  };
}

describe("ProductGrid", () => {
  it("renders the total product count", () => {
    render(
      <ProductGrid
        products={[
          createProduct(1, "First Product"),
        ]}
        total={20}
      />,
    );

    expect(
      screen.getByText("20 products found"),
    ).toBeInTheDocument();
  });

  it("renders the supplied products", () => {
    render(
      <ProductGrid
        products={[
          createProduct(1, "First Product"),
          createProduct(2, "Second Product"),
        ]}
        total={2}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "First Product",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Second Product",
      }),
    ).toBeInTheDocument();
  });

  it("shows the updating status when results are refetching", () => {
    render(
      <ProductGrid
        products={[
          createProduct(1, "First Product"),
        ]}
        total={1}
        isUpdating
      />,
    );

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "Updating results...",
    );
  });

  it("does not show the updating status by default", () => {
    render(
      <ProductGrid
        products={[
          createProduct(1, "First Product"),
        ]}
        total={1}
      />,
    );

    expect(
      screen.queryByRole("status"),
    ).not.toBeInTheDocument();
  });

  it("uses reduced opacity for placeholder data", () => {
    render(
      <ProductGrid
        products={[
          createProduct(1, "First Product"),
        ]}
        total={1}
        isPlaceholderData
      />,
    );

    expect(
      screen.getByRole("region", {
        name: "Product results",
      }),
    ).toHaveClass("opacity-60");
  });
});
