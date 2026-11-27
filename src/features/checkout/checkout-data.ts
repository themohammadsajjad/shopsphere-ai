import {
  getCartDiscount,
  getCartSubtotal,
} from "@/features/cart/cart-calculations";
import type {
  CartCoupon,
  CartItem,
} from "@/types/cart";
import type {
  CheckoutAddress,
  CheckoutCustomer,
  DeliveryMethod,
  DeliveryMethodId,
  MockPaymentMethod,
} from "@/types/checkout";
import type { OrderTotals } from "@/types/order";

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: "standard",
    label: "Standard delivery",
    description:
      "Reliable delivery in 4–6 business days.",
    cost: 0,
    etaMinDays: 4,
    etaMaxDays: 6,
  },
  {
    id: "express",
    label: "Express delivery",
    description:
      "Faster delivery in 2–3 business days.",
    cost: 199,
    etaMinDays: 2,
    etaMaxDays: 3,
  },
  {
    id: "priority",
    label: "Priority delivery",
    description:
      "Priority handling with delivery in 1–2 business days.",
    cost: 399,
    etaMinDays: 1,
    etaMaxDays: 2,
  },
];

export const MOCK_PAYMENT_METHODS: Array<{
  id: MockPaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: "mock-card",
    label: "Mock Card",
    description:
      "Test-mode card simulation. No card number or CVV is collected.",
  },
  {
    id: "mock-upi",
    label: "Mock UPI",
    description:
      "Test-mode UPI simulation. No UPI PIN or bank credentials are collected.",
  },
  {
    id: "mock-cod",
    label: "Mock Cash on Delivery",
    description:
      "Simulated cash-on-delivery selection for this frontend demo.",
  },
];

export type CheckoutErrors =
  Record<string, string>;

export function validateCustomer(
  customer: CheckoutCustomer,
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (
    customer.name.trim().length <
    2
  ) {
    errors.name =
      "Enter your full name.";
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      customer.email.trim(),
    )
  ) {
    errors.email =
      "Enter a valid email address.";
  }

  if (
    !/^[0-9]{10}$/.test(
      customer.phone,
    )
  ) {
    errors.phone =
      "Enter a valid 10-digit phone number.";
  }

  return errors;
}

export function validateAddress(
  address: CheckoutAddress,
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (
    address.line1.trim().length <
    5
  ) {
    errors.line1 =
      "Enter a complete street address.";
  }

  if (
    address.city.trim().length <
    2
  ) {
    errors.city =
      "Enter a valid city.";
  }

  if (
    address.state.trim().length <
    2
  ) {
    errors.state =
      "Enter a valid state.";
  }

  if (
    !/^[1-9][0-9]{5}$/.test(
      address.pinCode,
    )
  ) {
    errors.pinCode =
      "Enter a valid 6-digit Indian PIN code.";
  }

  return errors;
}

export function hasCheckoutErrors(
  errors: CheckoutErrors,
) {
  return (
    Object.keys(errors).length >
    0
  );
}

export function getDeliveryMethod(
  id?: DeliveryMethodId,
) {
  return (
    DELIVERY_METHODS.find(
      (method) =>
        method.id === id,
    ) ?? DELIVERY_METHODS[0]
  );
}

function roundCurrency(
  amount: number,
) {
  return Number(
    amount.toFixed(2),
  );
}

export function calculateCheckoutTotals(
  items: CartItem[],
  coupon: CartCoupon | undefined,
  deliveryMethodId:
    | DeliveryMethodId
    | undefined,
): OrderTotals {
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

  const delivery =
    getDeliveryMethod(
      deliveryMethodId,
    );

  const tax = roundCurrency(
    discountedSubtotal * 0.05,
  );

  const total = roundCurrency(
    discountedSubtotal +
      delivery.cost +
      tax,
  );

  return {
    subtotal,
    discount,
    shipping:
      delivery.cost,
    tax,
    total,
  };
}
