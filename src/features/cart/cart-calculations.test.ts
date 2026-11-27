import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  CartItem,
} from "@/types/cart";

import {
  calculateCartTotals,
  getCartDiscount,
  getCartSubtotal,
} from "./cart-calculations";

const items: CartItem[] = [
  {
    id: "1:default",
    productId: 1,
    title: "Product",
    price: 2000,
    thumbnail: "/file.svg",
    quantity: 2,
    stock: 5,
  },
];

describe("cart calculations", () => {
  it("calculates subtotal", () => {
    expect(
      getCartSubtotal(items),
    ).toBe(4000);
  });

  it("calculates percentage discount", () => {
    expect(
      getCartDiscount(
        4000,
        {
          code: "SHOP10",
          type: "percentage",
          value: 10,
        },
      ),
    ).toBe(400);
  });

  it("does not let a fixed discount exceed subtotal", () => {
    expect(
      getCartDiscount(
        300,
        {
          code: "SAVE500",
          type: "fixed",
          value: 500,
        },
      ),
    ).toBe(300);
  });

  it("calculates shipping tax and total", () => {
    expect(
      calculateCartTotals(
        items,
      ),
    ).toEqual({
      subtotal: 4000,
      discount: 0,
      shipping: 199,
      tax: 200,
      total: 4399,
    });
  });

  it("gives free shipping at the threshold", () => {
    const totals =
      calculateCartTotals([
        {
          ...items[0],
          price: 5000,
          quantity: 1,
        },
      ]);

    expect(
      totals.shipping,
    ).toBe(0);
  });
});
