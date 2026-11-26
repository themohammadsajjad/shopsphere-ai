import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { useWishlistStore } from "./wishlist-store";

describe("wishlist store", () => {
  beforeEach(() => {
    localStorage.clear();

    useWishlistStore.setState({
      productIds: [],
    });
  });

  it("adds and removes a product", () => {
    useWishlistStore
      .getState()
      .toggleProduct(10);

    expect(
      useWishlistStore.getState()
        .productIds,
    ).toEqual([10]);

    useWishlistStore
      .getState()
      .toggleProduct(10);

    expect(
      useWishlistStore.getState()
        .productIds,
    ).toEqual([]);
  });

  it("supports multiple wishlist products", () => {
    useWishlistStore
      .getState()
      .toggleProduct(1);

    useWishlistStore
      .getState()
      .toggleProduct(2);

    expect(
      useWishlistStore.getState()
        .productIds,
    ).toEqual([1, 2]);
  });
});
