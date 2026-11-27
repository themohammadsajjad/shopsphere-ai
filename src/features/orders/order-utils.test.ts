import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createStatusHistory,
  getNextOrderStatus,
  getOrderTimeline,
} from "./order-utils";
import type { Order } from "@/types/order";

function createShippedOrder(): Order {
  const start =
    new Date(
      "2026-11-27T10:00:00.000Z",
    );

  return {
    id: "SS-TEST-1",
    createdAt:
      start.toISOString(),
    expectedDeliveryDate:
      "2026-12-01T10:00:00.000Z",
    status: "Shipped",
    statusHistory:
      createStatusHistory(
        "Shipped",
        start,
      ),
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
}

describe("order tracking", () => {
  it("returns the next order status", () => {
    expect(
      getNextOrderStatus(
        "Packed",
      ),
    ).toBe("Shipped");
  });

  it("has no next status after delivery", () => {
    expect(
      getNextOrderStatus(
        "Delivered",
      ),
    ).toBeNull();
  });

  it("marks the first four stages complete for a shipped order", () => {
    const timeline =
      getOrderTimeline(
        createShippedOrder(),
      );

    expect(
      timeline
        .slice(0, 4)
        .every(
          (stage) =>
            stage.completed,
        ),
    ).toBe(true);

    expect(
      timeline[4].completed,
    ).toBe(false);

    expect(
      timeline[5].completed,
    ).toBe(false);
  });
});
