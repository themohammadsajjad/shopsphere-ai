"use client";

import {
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import { calculateCartTotals } from "@/features/cart/cart-calculations";
import { getProductVariants } from "@/features/products/product-variants";
import { RecommendationRail } from "@/features/recommendations/recommendation-rail";
import {
  ProductServiceError,
  getProductById,
} from "@/services/product-service";
import { useCartStore } from "@/store/cart-store";
import type {
  CartItem,
} from "@/types/cart";
import type {
  Product,
} from "@/types/product";
import { formatInr } from "@/utils/currency";

function getCurrentStock(
  item: CartItem,
  product?: Product,
) {
  if (!product) {
    return item.stock;
  }

  if (!item.variantId) {
    return product.stock;
  }

  const variant =
    getProductVariants(
      product,
    ).find(
      (candidate) =>
        candidate.id ===
        item.variantId,
    );

  return (
    variant?.stock ??
    product.stock
  );
}

type CartLineProps = {
  item: CartItem;
  product?: Product;
  unavailable: boolean;
};

function CartLine({
  item,
  product,
  unavailable,
}: CartLineProps) {
  const [limitMessage, setLimitMessage] =
    useState("");

  const removeItem =
    useCartStore(
      (state) =>
        state.removeItem,
    );

  const updateQuantity =
    useCartStore(
      (state) =>
        state.updateQuantity,
    );

  const syncStock =
    useCartStore(
      (state) =>
        state.syncStock,
    );

  const confirmPrice =
    useCartStore(
      (state) =>
        state.confirmPrice,
    );

  const saveForLater =
    useCartStore(
      (state) =>
        state.saveForLater,
    );

  const currentStock =
    unavailable
      ? 0
      : getCurrentStock(
          item,
          product,
        );

  const visibleQuantity =
    currentStock > 0
      ? Math.min(
          item.quantity,
          currentStock,
        )
      : item.quantity;

  const priceChanged =
    product &&
    Math.abs(
      product.price -
        item.price,
    ) > 0.01;

  function decrease() {
    setLimitMessage("");

    updateQuantity(
      item.id,
      visibleQuantity - 1,
    );
  }

  function increase() {
    if (
      currentStock <= 0
    ) {
      return;
    }

    if (
      visibleQuantity >=
      currentStock
    ) {
      syncStock(
        item.id,
        currentStock,
      );

      setLimitMessage(
        `Only ${currentStock} units are available. Quantity has been limited to available stock.`,
      );

      return;
    }

    setLimitMessage("");

    updateQuantity(
      item.id,
      visibleQuantity + 1,
    );
  }

  return (
    <article className="glass-panel rounded-3xl border p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted/30">
          <Image
            src={
              product?.thumbnail ??
              item.thumbnail
            }
            alt={item.title}
            fill
            sizes="128px"
            className="object-contain p-3"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                href={`/products/${item.productId}`}
                className="font-semibold hover:underline"
              >
                {item.title}
              </Link>

              {item.variantLabel ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Variant:{" "}
                  {
                    item.variantLabel
                  }
                </p>
              ) : null}
            </div>

            <p className="font-semibold">
              {formatInr(
                priceChanged
                  ? product.price
                  : item.price,
              )}
            </p>
          </div>

          {unavailable ? (
            <p className="mt-3 text-sm font-medium text-destructive">
              Product no longer
              available. Remove it
              from your cart before
              checkout.
            </p>
          ) : currentStock <=
            0 ? (
            <p className="mt-3 text-sm font-medium text-destructive">
              Out of stock.
              Checkout is blocked
              until this item is
              removed or becomes
              available.
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {currentStock} in
              stock
            </p>
          )}

          {priceChanged &&
          product ? (
            <div className="mt-3 rounded-2xl border p-3 text-sm">
              <p className="font-medium">
                Price changed
              </p>

              <p className="mt-1 text-muted-foreground">
                Added at{" "}
                {formatInr(
                  item.price,
                )}
                . Current price is{" "}
                {formatInr(
                  product.price,
                )}
                .
              </p>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() =>
                  confirmPrice(
                    item.id,
                    product.price,
                  )
                }
              >
                Accept new price
              </Button>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              aria-label={`Decrease quantity for ${item.title}`}
              disabled={
                currentStock <=
                  0 ||
                visibleQuantity <=
                  1
              }
              onClick={
                decrease
              }
            >
              −
            </Button>

            <output
              aria-label={`Quantity for ${item.title}`}
              className="min-w-10 text-center font-medium"
            >
              {visibleQuantity}
            </output>

            <Button
              type="button"
              variant="outline"
              aria-label={`Increase quantity for ${item.title}`}
              disabled={
                currentStock <=
                0
              }
              onClick={
                increase
              }
            >
              +
            </Button>
          </div>

          {limitMessage ? (
            <p
              role="status"
              className="mt-2 text-sm font-medium"
            >
              {limitMessage}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                saveForLater(
                  item.id,
                )
              }
            >
              Save for later
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                removeItem(
                  item.id,
                )
              }
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SavedItems() {
  const savedItems =
    useCartStore(
      (state) =>
        state.savedItems,
    );

  const moveSavedToCart =
    useCartStore(
      (state) =>
        state.moveSavedToCart,
    );

  const removeSavedItem =
    useCartStore(
      (state) =>
        state.removeSavedItem,
    );

  if (
    savedItems.length === 0
  ) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold">
        Saved for later
      </h2>

      <div className="mt-4 space-y-3">
        {savedItems.map(
          (item) => (
            <article
              key={item.id}
              className="glass-panel flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  {item.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatInr(
                    item.price,
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={
                    item.stock <=
                    0
                  }
                  onClick={() =>
                    moveSavedToCart(
                      item.id,
                    )
                  }
                >
                  Move to cart
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    removeSavedItem(
                      item.id,
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

export function CartView() {
  const [couponInput, setCouponInput] =
    useState("");

  const items =
    useCartStore(
      (state) => state.items,
    );

  const appliedCoupon =
    useCartStore(
      (state) =>
        state.appliedCoupon,
    );

  const couponError =
    useCartStore(
      (state) =>
        state.couponError,
    );

  const applyCoupon =
    useCartStore(
      (state) =>
        state.applyCoupon,
    );

  const clearCoupon =
    useCartStore(
      (state) =>
        state.clearCoupon,
    );

  const hasHydrated =
    useSyncExternalStore(
      (onStoreChange) =>
        useCartStore.persist.onFinishHydration(
          onStoreChange,
        ),
      () =>
        useCartStore.persist.hasHydrated(),
      () => false,
    );

  const productQueries =
    useQueries({
      queries: items.map(
        (item) => ({
          queryKey: [
            "cart-product",
            item.productId,
          ],
          queryFn: () =>
            getProductById(
              item.productId,
            ),
          retry: false,
        }),
      ),
    });

  if (!hasHydrated) {
    return (
      <div
        role="status"
        className="h-72 animate-pulse rounded-3xl border bg-muted/40"
      />
    );
  }

  const unavailableItems =
    items.filter(
      (_, index) => {
        const error =
          productQueries[index]
            ?.error;

        return (
          error instanceof
            ProductServiceError &&
          error.status === 404
        );
      },
    );

  const networkFailure =
    productQueries.some(
      (query) =>
        query.isError &&
        !(
          query.error instanceof
            ProductServiceError &&
          query.error.status ===
            404
        ),
    );

  const priceChanged =
    items.some(
      (item, index) => {
        const product =
          productQueries[index]
            ?.data;

        return (
          product &&
          Math.abs(
            product.price -
              item.price,
          ) > 0.01
        );
      },
    );

  const outOfStock =
    items.some(
      (item, index) => {
        const product =
          productQueries[index]
            ?.data;

        if (!product) {
          return (
            item.stock <= 0
          );
        }

        return (
          getCurrentStock(
            item,
            product,
          ) <= 0
        );
      },
    );

  const itemsForTotals =
    items.map(
      (item, index) => {
        const product =
          productQueries[index]
            ?.data;

        if (!product) {
          return item;
        }

        const currentStock =
          getCurrentStock(
            item,
            product,
          );

        if (
          currentStock <= 0
        ) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(
            item.quantity,
            currentStock,
          ),
        };
      },
    );

  const totals =
    calculateCartTotals(
      itemsForTotals,
      appliedCoupon,
    );

  const checkoutBlocked =
    items.length === 0 ||
    unavailableItems.length >
      0 ||
    outOfStock ||
    priceChanged;

  return (
    <div>
      {networkFailure ? (
        <div
          role="alert"
          className="mb-5 rounded-2xl border p-4 text-sm"
        >
          Product service is
          temporarily unavailable.
          Showing your last-known
          cached cart data.
        </div>
      ) : null}

      {items.length === 0 ? (
        <section className="glass-panel rounded-3xl border p-8 text-center">
          <h2 className="text-2xl font-semibold">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Browse products and add
            something you like.
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
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="space-y-4">
            {items.map(
              (item, index) => {
                const query =
                  productQueries[
                    index
                  ];

                const unavailable =
                  query?.error instanceof
                    ProductServiceError &&
                  query.error
                    .status === 404;

                return (
                  <CartLine
                    key={
                      item.id
                    }
                    item={item}
                    product={
                      query?.data
                    }
                    unavailable={
                      unavailable
                    }
                  />
                );
              },
            )}
          </section>

          <aside className="glass-panel h-fit rounded-3xl border p-5 lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold">
              Order summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Subtotal
                </span>
                <span>
                  {formatInr(
                    totals.subtotal,
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Discount
                </span>
                <span>
                  −{" "}
                  {formatInr(
                    totals.discount,
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Shipping
                </span>
                <span>
                  {totals.shipping ===
                  0
                    ? "Free"
                    : formatInr(
                        totals.shipping,
                      )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Tax
                </span>
                <span>
                  {formatInr(
                    totals.tax,
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t pt-3 text-base font-semibold">
                <span>Total</span>
                <span>
                  {formatInr(
                    totals.total,
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t pt-5">
              <label
                htmlFor="coupon"
                className="text-sm font-medium"
              >
                Coupon code
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  id="coupon"
                  value={
                    couponInput
                  }
                  onChange={(
                    event,
                  ) =>
                    setCouponInput(
                      event.target
                        .value,
                    )
                  }
                  placeholder="SHOP10"
                  className="h-9 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    applyCoupon(
                      couponInput,
                    )
                  }
                >
                  Apply
                </Button>
              </div>

              {couponError ? (
                <p
                  role="alert"
                  className="mt-2 text-sm text-destructive"
                >
                  {couponError}
                </p>
              ) : null}

              {appliedCoupon ? (
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span>
                    {
                      appliedCoupon.code
                    }{" "}
                    applied
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={
                      clearCoupon
                    }
                  >
                    Remove
                  </Button>
                </div>
              ) : null}
            </div>

            {checkoutBlocked ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Resolve unavailable,
                out-of-stock, or
                changed-price items
                before checkout.
              </p>
            ) : null}

            {checkoutBlocked ? (
              <Button
                type="button"
                disabled
                className="mt-4 w-full"
              >
                Proceed to checkout
              </Button>
            ) : (
              <Link
                href="/checkout"
                className={buttonVariants({
                  className:
                    "mt-4 w-full",
                })}
              >
                Proceed to checkout
              </Link>
            )}
          </aside>
        </div>
      )}

      <SavedItems />

      <div className="mt-10">
        <RecommendationRail strategy="cart-based" />
      </div>
    </div>
  );
}
