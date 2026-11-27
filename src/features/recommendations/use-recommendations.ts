"use client";

import { useQuery } from "@tanstack/react-query";

import { getRecommendations } from "@/services/recommendation-service";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";
import type { RecommendationStrategy } from "@/types/recommendation";

type UseRecommendationsOptions = {
  strategy: RecommendationStrategy;
  seedProduct?: Product;
  limit?: number;
};

export function useRecommendations({
  strategy,
  seedProduct,
  limit = 4,
}: UseRecommendationsOptions) {
  const recent =
    useRecentlyViewedStore(
      (state) =>
        state.products,
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

  const signalKey = [
    recent
      .map((item) => item.id)
      .join(","),
    wishlist.join(","),
    cart
      .map(
        (item) =>
          `${item.productId}:${item.quantity}`,
      )
      .join(","),
    orders
      .flatMap(
        (order) =>
          order.items.map(
            (item) =>
              item.productId,
          ),
      )
      .join(","),
  ].join("|");

  return useQuery({
    queryKey: [
      "recommendations",
      strategy,
      seedProduct?.id ?? 0,
      limit,
      signalKey,
    ],
    queryFn: () =>
      getRecommendations({
        strategy,
        seedProduct,
        limit,
      }),
    staleTime: 30_000,
  });
}
