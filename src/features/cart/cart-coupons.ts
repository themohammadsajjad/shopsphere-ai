import type { CartCoupon } from "@/types/cart";

const COUPONS: Record<
  string,
  CartCoupon
> = {
  SHOP10: {
    code: "SHOP10",
    type: "percentage",
    value: 10,
  },
  SAVE500: {
    code: "SAVE500",
    type: "fixed",
    value: 500,
  },
};

export type CouponResult =
  | {
      coupon: CartCoupon;
      error?: never;
    }
  | {
      coupon?: never;
      error: string;
    };

export function getCartCoupon(
  input: string,
): CouponResult {
  const code = input
    .trim()
    .toUpperCase();

  if (!code) {
    return {
      error:
        "Enter a coupon code.",
    };
  }

  if (code === "EXPIRED20") {
    return {
      error:
        "This coupon has expired.",
    };
  }

  const coupon = COUPONS[code];

  if (!coupon) {
    return {
      error:
        "This coupon code is not valid.",
    };
  }

  return {
    coupon,
  };
}
