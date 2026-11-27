import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import type { Order } from "@/types/order";

import { useOrderStore } from "./order-store";

const order: Order = {
  id: "SS-TEST",
  createdAt:
    "2026-11-27T10:00:00.000Z",
  expectedDeliveryDate:
    "2026-12-01T10:00:00.000Z",
  status: "Order Placed",
  statusHistory: [
    {
      status:
        "Order Placed",
      timestamp:
        "2026-11-27T10:00:00.000Z",
    },
  ],
  items: [],
  customer: {
    name: "Demo",
    email:
      "demo@example.com",
    phone:
      "9876543210",
  },
  address: {
    line1:
      "123 Test Street",
    line2: "",
    city: "Ludhiana",
    state: "Punjab",
    pinCode: "141001",
  },
  deliveryMethod: {
    id: "standard",
    label:
      "Standard delivery",
    description: "Test",
    cost: 0,
    etaMinDays: 4,
    etaMaxDays: 6,
  },
  paymentMethod:
    "mock-card",
  totals: {
    subtotal: 1000,
    discount: 0,
    shipping: 0,
    tax: 50,
    total: 1050,
  },
};

describe("order store", () => {
  beforeEach(() => {
    localStorage.clear();

    useOrderStore.setState({
      orders: [],
    });
  });

  it("adds an order to history", () => {
    useOrderStore
      .getState()
      .addOrder(order);

    expect(
      useOrderStore.getState()
        .orders,
    ).toHaveLength(1);
  });

  it("advances an order status", () => {
    useOrderStore
      .getState()
      .addOrder(order);

    useOrderStore
      .getState()
      .advanceOrderStatus(
        order.id,
      );

    expect(
      useOrderStore.getState()
        .orders[0].status,
    ).toBe("Confirmed");
  });
});
