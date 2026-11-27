import type {
  CartCoupon,
  CartItem,
} from "@/types/cart";

function roundCurrency(
  amount: number,
) {
  return Number(
    amount.toFixed(2),
  );
}

export function getCartSubtotal(
  items: CartItem[],
) {
  return roundCurrency(
    items.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0,
    ),
  );
}

export function getCartDiscount(
  subtotal: number,
  coupon?: CartCoupon,
) {
  if (!coupon) {
    return 0;
  }

  if (
    coupon.type ===
    "percentage"
  ) {
    return roundCurrency(
      Math.min(
        subtotal,
        subtotal *
          (coupon.value / 100),
      ),
    );
  }

  return roundCurrency(
    Math.min(
      subtotal,
      coupon.value,
    ),
  );
}

export function calculateCartTotals(
  items: CartItem[],
  coupon?: CartCoupon,
) {
  const subtotal =
    getCartSubtotal(items);

  const discount =
    getCartDiscount(
      subtotal,
      coupon,
    );

  const discountedSubtotal =
    Math.max(
      0,
      subtotal - discount,
    );

  const shipping =
    discountedSubtotal === 0 ||
    discountedSubtotal >= 5000
      ? 0
      : 199;

  const tax = roundCurrency(
    discountedSubtotal * 0.05,
  );

  const total = roundCurrency(
    discountedSubtotal +
      shipping +
      tax,
  );

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
}
