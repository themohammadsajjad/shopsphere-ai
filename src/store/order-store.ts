"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getNextOrderStatus,
} from "@/features/orders/order-utils";
import type { Order } from "@/types/order";

type OrderState = {
  orders: Order[];

  addOrder: (
    order: Order,
  ) => void;

  advanceOrderStatus: (
    orderId: string,
  ) => void;

  clearOrders:
    () => void;
};

export const useOrderStore =
  create<OrderState>()(
    persist(
      (set) => ({
        orders: [],

        addOrder: (order) =>
          set((state) => ({
            orders: [
              order,
              ...state.orders.filter(
                (existing) =>
                  existing.id !==
                  order.id,
              ),
            ],
          })),

        advanceOrderStatus:
          (orderId) =>
            set((state) => ({
              orders:
                state.orders.map(
                  (order) => {
                    if (
                      order.id !==
                      orderId
                    ) {
                      return order;
                    }

                    const next =
                      getNextOrderStatus(
                        order.status,
                      );

                    if (!next) {
                      return order;
                    }

                    return {
                      ...order,
                      status: next,
                      statusHistory: [
                        ...order.statusHistory,
                        {
                          status:
                            next,
                          timestamp:
                            new Date().toISOString(),
                        },
                      ],
                    };
                  },
                ),
            })),

        clearOrders: () =>
          set({
            orders: [],
          }),
      }),
      {
        name:
          "shopsphere-orders",
      },
    ),
  );
