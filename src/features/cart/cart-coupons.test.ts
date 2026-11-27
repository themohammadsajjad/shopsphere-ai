import {
  describe,
  expect,
  it,
} from "vitest";

import { getCartCoupon } from "./cart-coupons";

describe("cart coupons", () => {
  it("accepts SHOP10", () => {
    expect(
      getCartCoupon(
        "shop10",
      ),
    ).toMatchObject({
      coupon: {
        code: "SHOP10",
        type: "percentage",
        value: 10,
      },
    });
  });

  it("reports expired coupons", () => {
    expect(
      getCartCoupon(
        "EXPIRED20",
      ),
    ).toEqual({
      error:
        "This coupon has expired.",
    });
  });

  it("reports invalid coupons", () => {
    expect(
      getCartCoupon(
        "NOPE",
      ),
    ).toEqual({
      error:
        "This coupon code is not valid.",
    });
  });
});
