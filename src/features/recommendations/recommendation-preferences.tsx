"use client";

import {
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  clearRecentSearches,
  getRecentSearches,
} from "@/features/products/search-history";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatInr } from "@/utils/currency";

export function RecommendationPreferences() {
  const [searches, setSearches] =
    useState<string[]>(
      () => getRecentSearches(),
    );

  const recent =
    useRecentlyViewedStore(
      (state) =>
        state.products,
    );

  const clearRecent =
    useRecentlyViewedStore(
      (state) =>
        state.clearProducts,
    );

  const wishlist =
    useWishlistStore(
      (state) =>
        state.productIds,
    );

  const cart =
    useCartStore(
      (state) =>
        state.items,
    );

  const orders =
    useOrderStore(
      (state) =>
        state.orders,
    );

  const priceBand =
    useMemo(() => {
      const prices = [
        ...recent.map(
          (product) =>
            product.price,
        ),
        ...cart.map(
          (item) =>
            item.price,
        ),
        ...orders.flatMap(
          (order) =>
            order.items.map(
              (item) =>
                item.price,
            ),
        ),
      ];

      if (
        prices.length === 0
      ) {
        return null;
      }

      return {
        min: Math.min(
          ...prices,
        ),
        max: Math.max(
          ...prices,
        ),
      };
    }, [
      cart,
      orders,
      recent,
    ]);

  function resetBrowsingSignals() {
    clearRecent();
    clearRecentSearches();
    setSearches([]);
  }

  return (
    <article className="glass-panel rounded-3xl border p-6 md:col-span-2 xl:col-span-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Recommendation
            Preferences
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Why you see these
            recommendations
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            ShopSphere uses
            explainable local
            signals rather than a
            black-box profile.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={
            resetBrowsingSignals
          }
        >
          Reset browsing signals
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border p-4">
          <p className="text-xs text-muted-foreground">
            Recently viewed
          </p>

          <p className="mt-2 font-medium">
            {recent.length
              ? recent
                  .slice(0, 3)
                  .map(
                    (item) =>
                      item.title,
                  )
                  .join(", ")
              : "No browsing history yet"}
          </p>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="text-xs text-muted-foreground">
            Recent searches
          </p>

          <p className="mt-2 font-medium">
            {searches.length
              ? searches.join(
                  ", ",
                )
              : "No recent searches"}
          </p>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="text-xs text-muted-foreground">
            Typical price range
          </p>

          <p className="mt-2 font-medium">
            {priceBand
              ? `${formatInr(
                  priceBand.min,
                )}–${formatInr(
                  priceBand.max,
                )}`
              : "Not enough signals yet"}
          </p>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="text-xs text-muted-foreground">
            Active commerce
            signals
          </p>

          <p className="mt-2 font-medium">
            {wishlist.length}{" "}
            wishlist ·{" "}
            {cart.length} cart ·{" "}
            {orders.length} orders
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        Resetting browsing signals
        clears recent views and
        search history only. Cart,
        wishlist, and order history
        are transactional data and
        are not deleted.
      </p>
    </article>
  );
}
