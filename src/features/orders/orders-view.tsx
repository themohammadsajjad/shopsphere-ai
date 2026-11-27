"use client";

import {
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import {
  buttonVariants,
} from "@/components/ui/button";
import { useOrderStore } from "@/store/order-store";
import { formatInr } from "@/utils/currency";

export function OrdersView() {
  const orders =
    useOrderStore(
      (state) =>
        state.orders,
    );

  const hydrated =
    useSyncExternalStore(
      (change) =>
        useOrderStore.persist.onFinishHydration(
          change,
        ),
      () =>
        useOrderStore.persist.hasHydrated(),
      () => false,
    );

  if (!hydrated) {
    return (
      <div
        role="status"
        className="h-72 animate-pulse rounded-3xl border bg-muted/40"
      />
    );
  }

  if (
    orders.length === 0
  ) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h2 className="text-2xl font-semibold">
          No orders yet
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Your completed
          checkout orders will
          appear here.
        </p>

        <Link
          href="/products"
          className={buttonVariants({
            className:
              "mt-5",
          })}
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(
        (order) => (
          <article
            key={order.id}
            className="glass-panel rounded-3xl border p-5 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-sm font-semibold">
                  {order.id}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  {new Date(
                    order.createdAt,
                  ).toLocaleDateString(
                    "en-IN",
                  )}
                  {" · "}
                  {
                    order.items
                      .length
                  }{" "}
                  item
                  {order.items
                    .length === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="font-semibold">
                  {formatInr(
                    order.totals
                      .total,
                  )}
                </p>

                <p className="mt-1 text-sm font-medium">
                  {order.status}
                </p>
              </div>
            </div>

            <Link
              href={`/orders/${order.id}`}
              className={buttonVariants({
                variant:
                  "outline",
                className:
                  "mt-5",
              })}
            >
              View tracking
            </Link>
          </article>
        ),
      )}
    </div>
  );
}
