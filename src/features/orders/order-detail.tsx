"use client";

import {
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import {
  buttonVariants,
} from "@/components/ui/button";
import {
  getOrderTimeline,
} from "@/features/orders/order-utils";
import { useOrderStore } from "@/store/order-store";
import { formatInr } from "@/utils/currency";

export function OrderDetail({
  orderId,
}: {
  orderId: string;
}) {
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

  const order =
    orders.find(
      (candidate) =>
        candidate.id ===
        orderId,
    );

  if (!order) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h2 className="text-2xl font-semibold">
          Order not found
        </h2>

        <Link
          href="/orders"
          className={buttonVariants({
            className:
              "mt-5",
          })}
        >
          Back to Orders
        </Link>
      </section>
    );
  }

  const timeline =
    getOrderTimeline(order);

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-3xl border p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Order ID
            </p>

            <h2 className="mt-1 font-mono text-xl font-semibold">
              {order.id}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Expected delivery{" "}
              {new Date(
                order.expectedDeliveryDate,
              ).toLocaleDateString(
                "en-IN",
              )}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-muted-foreground">
              Current status
            </p>

            <p className="mt-1 text-lg font-semibold">
              {order.status}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label="Order tracking"
        className="glass-panel rounded-3xl border p-5 sm:p-7"
      >
        <h2 className="text-2xl font-semibold">
          Order Tracking
        </h2>

        <ol className="mt-6 space-y-4">
          {timeline.map(
            (stage) => (
              <li
                key={
                  stage.status
                }
                className="flex gap-4"
              >
                <span
                  aria-hidden="true"
                  className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${
                    stage.completed
                      ? "bg-foreground"
                      : "bg-background"
                  }`}
                />

                <div>
                  <p
                    className={
                      stage.current
                        ? "font-semibold"
                        : stage.completed
                          ? "font-medium"
                          : "text-muted-foreground"
                    }
                  >
                    {
                      stage.status
                    }
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {stage.completed &&
                    stage.timestamp
                      ? new Date(
                          stage.timestamp,
                        ).toLocaleString(
                          "en-IN",
                        )
                      : "Upcoming"}
                  </p>
                </div>
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-3xl border p-5">
          <h2 className="text-xl font-semibold">
            Items
          </h2>

          <div className="mt-4 space-y-3">
            {order.items.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="flex justify-between gap-4 border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {
                        item.title
                      }
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Qty{" "}
                      {
                        item.quantity
                      }
                    </p>
                  </div>

                  <p>
                    {formatInr(
                      item.price *
                        item.quantity,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="glass-panel rounded-3xl border p-5">
          <h2 className="text-xl font-semibold">
            Delivery Address
          </h2>

          <address className="mt-4 not-italic text-sm leading-6 text-muted-foreground">
            {order.address.line1}
            <br />

            {order.address.line2
              ? (
                  <>
                    {
                      order.address
                        .line2
                    }
                    <br />
                  </>
                )
              : null}

            {order.address.city},{" "}
            {order.address.state}
            <br />
            {
              order.address
                .pinCode
            }
          </address>

          <div className="mt-5 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Order total
            </p>

            <p className="mt-1 text-xl font-semibold">
              {formatInr(
                order.totals
                  .total,
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
