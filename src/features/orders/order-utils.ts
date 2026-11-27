import {
  getDeliveryMethod,
  calculateCheckoutTotals,
} from "@/features/checkout/checkout-data";
import type {
  CartCoupon,
  CartItem,
} from "@/types/cart";
import type {
  CheckoutAddress,
  CheckoutCustomer,
  DeliveryMethodId,
  MockPaymentMethod,
} from "@/types/checkout";
import {
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
  type OrderStatusEntry,
} from "@/types/order";

type CreateOrderInput = {
  items: CartItem[];
  coupon?: CartCoupon;
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  deliveryMethodId:
    DeliveryMethodId;
  paymentMethod:
    MockPaymentMethod;
};

export function createOrder(
  input: CreateOrderInput,
): Order {
  const now = new Date();

  const deliveryMethod =
    getDeliveryMethod(
      input.deliveryMethodId,
    );

  const orderId = `SS-${now
    .getTime()
    .toString(36)
    .toUpperCase()}-${crypto
    .randomUUID()
    .slice(0, 4)
    .toUpperCase()}`;

  const expected =
    new Date(
      now.getTime() +
        deliveryMethod
          .etaMaxDays *
          24 *
          60 *
          60 *
          1000,
    );

  return {
    id: orderId,
    createdAt:
      now.toISOString(),
    expectedDeliveryDate:
      expected.toISOString(),
    status:
      "Order Placed",
    statusHistory: [
      {
        status:
          "Order Placed",
        timestamp:
          now.toISOString(),
      },
    ],
    items: input.items.map(
      (item) => ({
        ...item,
      }),
    ),
    customer: {
      ...input.customer,
    },
    address: {
      ...input.address,
    },
    deliveryMethod,
    paymentMethod:
      input.paymentMethod,
    couponCode:
      input.coupon?.code,
    totals:
      calculateCheckoutTotals(
        input.items,
        input.coupon,
        input.deliveryMethodId,
      ),
  };
}

export function getNextOrderStatus(
  status: OrderStatus,
) {
  const index =
    ORDER_STATUSES.indexOf(
      status,
    );

  if (
    index < 0 ||
    index ===
      ORDER_STATUSES.length -
        1
  ) {
    return null;
  }

  return ORDER_STATUSES[
    index + 1
  ];
}

export function createStatusHistory(
  status: OrderStatus,
  startDate = new Date(),
): OrderStatusEntry[] {
  const currentIndex =
    ORDER_STATUSES.indexOf(
      status,
    );

  return ORDER_STATUSES
    .slice(
      0,
      currentIndex + 1,
    )
    .map(
      (
        stage,
        index,
      ) => ({
        status: stage,
        timestamp:
          new Date(
            startDate.getTime() +
              index *
                60 *
                60 *
                1000,
          ).toISOString(),
      }),
    );
}

export function getOrderTimeline(
  order: Order,
) {
  const currentIndex =
    ORDER_STATUSES.indexOf(
      order.status,
    );

  return ORDER_STATUSES.map(
    (status, index) => {
      const history =
        order.statusHistory.find(
          (entry) =>
            entry.status ===
            status,
        );

      return {
        status,
        completed:
          index <=
          currentIndex,
        current:
          index ===
          currentIndex,
        timestamp:
          history?.timestamp,
      };
    },
  );
}
