import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { useCartStore } from "./cart-store";

const item = {
  productId: 1,
  title: "Running Shoes",
  price: 3000,
  thumbnail:
    "https://example.com/image.webp",
  quantity: 1,
  stock: 3,
  variantId: "variant-7",
  variantLabel: "7",
};

describe("cart store", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      items: [],
    });
  });

  it("adds a product to cart", () => {
    useCartStore
      .getState()
      .addItem(item);

    expect(
      useCartStore.getState()
        .items,
    ).toHaveLength(1);

    expect(
      useCartStore.getState()
        .items[0].quantity,
    ).toBe(1);
  });

  it("increments duplicate cart lines", () => {
    useCartStore
      .getState()
      .addItem(item);

    useCartStore
      .getState()
      .addItem(item);

    expect(
      useCartStore.getState()
        .items,
    ).toHaveLength(1);

    expect(
      useCartStore.getState()
        .items[0].quantity,
    ).toBe(2);
  });

  it("clamps duplicate quantity to stock", () => {
    useCartStore
      .getState()
      .addItem({
        ...item,
        quantity: 3,
      });

    useCartStore
      .getState()
      .addItem(item);

    expect(
      useCartStore.getState()
        .items[0].quantity,
    ).toBe(3);
  });
});
