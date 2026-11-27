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
    "/file.svg",
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
      savedItems: [],
      appliedCoupon:
        undefined,
      couponError:
        undefined,
    });
  });

  it("adds a product", () => {
    useCartStore
      .getState()
      .addItem(item);

    expect(
      useCartStore.getState()
        .items,
    ).toHaveLength(1);
  });

  it("increments duplicate items instead of adding another line", () => {
    const store =
      useCartStore.getState();

    store.addItem(item);
    store.addItem(item);

    const items =
      useCartStore.getState()
        .items;

    expect(items).toHaveLength(
      1,
    );

    expect(
      items[0].quantity,
    ).toBe(2);
  });

  it("clamps quantity to available stock", () => {
    useCartStore
      .getState()
      .addItem(item);

    useCartStore
      .getState()
      .updateQuantity(
        "1:variant-7",
        5,
      );

    expect(
      useCartStore.getState()
        .items[0].quantity,
    ).toBe(3);
  });

  it("moves an item to saved for later", () => {
    useCartStore
      .getState()
      .addItem(item);

    useCartStore
      .getState()
      .saveForLater(
        "1:variant-7",
      );

    expect(
      useCartStore.getState()
        .items,
    ).toHaveLength(0);

    expect(
      useCartStore.getState()
        .savedItems,
    ).toHaveLength(1);
  });

  it("moves a saved item back to cart", () => {
    useCartStore
      .getState()
      .addItem(item);

    useCartStore
      .getState()
      .saveForLater(
        "1:variant-7",
      );

    useCartStore
      .getState()
      .moveSavedToCart(
        "1:variant-7",
      );

    expect(
      useCartStore.getState()
        .items,
    ).toHaveLength(1);

    expect(
      useCartStore.getState()
        .savedItems,
    ).toHaveLength(0);
  });

  it("does not move an out-of-stock saved item into cart", () => {
    useCartStore.setState({
      items: [],
      savedItems: [
        {
          ...item,
          id: "1:variant-7",
          stock: 0,
        },
      ],
    });

    useCartStore
      .getState()
      .moveSavedToCart(
        "1:variant-7",
      );

    expect(
      useCartStore.getState()
        .items,
    ).toHaveLength(0);

    expect(
      useCartStore.getState()
        .savedItems,
    ).toHaveLength(1);
  });

  it("applies a valid coupon", () => {
    useCartStore
      .getState()
      .applyCoupon(
        "SHOP10",
      );

    expect(
      useCartStore.getState()
        .appliedCoupon?.code,
    ).toBe("SHOP10");
  });

  it("keeps an error for an invalid coupon", () => {
    useCartStore
      .getState()
      .applyCoupon(
        "INVALID",
      );

    expect(
      useCartStore.getState()
        .couponError,
    ).toBe(
      "This coupon code is not valid.",
    );
  });

  it("confirms a changed product price", () => {
    useCartStore
      .getState()
      .addItem(item);

    useCartStore
      .getState()
      .confirmPrice(
        "1:variant-7",
        3500,
      );

    expect(
      useCartStore.getState()
        .items[0].price,
    ).toBe(3500);
  });
});
