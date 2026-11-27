import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { Product } from "@/types/product";

import { ProductGallery } from "./product-gallery";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
  }) => (
    <span
      role="img"
      aria-label={alt || "Product thumbnail"}
      data-src={src}
    />
  ),
}));

function createProduct(): Product {
  return {
    id: 1,
    title: "Gallery Product",
    description: "Test product",
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
      qrCode:
        "https://example.com/qr",
    },
    images: [
      "/file.svg",
      "/globe.svg",
    ],
    thumbnail: "/file.svg",
  };
}

describe("ProductGallery", () => {
  it("shows the first product image by default", () => {
    render(
      <ProductGallery
        product={createProduct()}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Gallery Product",
      }),
    ).toHaveAttribute(
      "data-src",
      "/file.svg",
    );
  });

  it("changes the main image when a thumbnail is selected", () => {
    render(
      <ProductGallery
        product={createProduct()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "View product image 2",
      }),
    );

    expect(
      screen.getByRole("img", {
        name: "Gallery Product",
      }),
    ).toHaveAttribute(
      "data-src",
      "/globe.svg",
    );
  });
});
