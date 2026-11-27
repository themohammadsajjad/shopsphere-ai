import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";

import { ProductPurchasePanel } from "./product-purchase-panel";

const { pushMock } =
  vi.hoisted(() => ({
    pushMock: vi.fn(),
  }));

vi.mock(
  "next/navigation",
  () => ({
    useRouter: () => ({
      push: pushMock,
    }),
  }),
);

function createProduct(): Product {
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
  };
}

describe("ProductPurchasePanel", () => {
  beforeEach(() => {
    pushMock.mockClear();

    useCartStore.setState({
      items: [],
    });

    useWishlistStore.setState({
      productIds: [],
    });
  });

  it("disables Add to Cart for an out-of-stock selected variant", () => {
    render(
      <ProductPurchasePanel
        product={createProduct()}
      />,
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: "8 - Out of stock",
        },
      ),
    );

    expect(
      screen.getByRole(
        "button",
        {
          name: "Variant unavailable",
        },
      ),
    ).toBeDisabled();

    expect(
      screen.getByText(
        /selected variant is out of stock/i,
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: /7 - .* in stock/i,
        },
      ),
    );

    expect(
      screen.getByRole(
        "button",
        {
          name: "Add to Cart",
        },
      ),
    ).toBeEnabled();
  });

  it("adds the selected product to cart", () => {
    render(
      <ProductPurchasePanel
        product={createProduct()}
      />,
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: "Add to Cart",
        },
      ),
    );

    expect(
      useCartStore.getState()
        .items,
    ).toHaveLength(1);

    expect(
      useCartStore.getState()
        .items[0],
    ).toMatchObject({
      productId: 1,
      quantity: 1,
      variantLabel: "7",
    });
  });

  it("routes Buy Now to checkout", () => {
    render(
      <ProductPurchasePanel
        product={createProduct()}
      />,
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: "Buy Now",
        },
      ),
    );

    expect(
      pushMock,
    ).toHaveBeenCalledWith(
      "/checkout",
    );
  });
});
