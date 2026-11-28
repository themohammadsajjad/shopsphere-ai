"use client";

import {
  useEffect,
  useRef,
} from "react";

import { ProductCard } from "@/features/products/product-card";
import { useRecommendations } from "@/features/recommendations/use-recommendations";
import { useRecommendationAnalyticsStore } from "@/store/recommendation-analytics-store";
import type { Product } from "@/types/product";
import type { RecommendationStrategy } from "@/types/recommendation";

type RecommendationRailProps = {
  strategy: RecommendationStrategy;
  seedProduct?: Product;
  limit?: number;
  titleOverride?: string;
};

export function RecommendationRail({
  strategy,
  seedProduct,
  limit = 4,
  titleOverride,
}: RecommendationRailProps) {
  const query =
    useRecommendations({
      strategy,
      seedProduct,
      limit,
    });

  const recorded =
    useRef(false);

  const recordImpression =
    useRecommendationAnalyticsStore(
      (state) =>
        state.recordImpression,
    );

  const recordClick =
    useRecommendationAnalyticsStore(
      (state) =>
        state.recordClick,
    );

  useEffect(() => {
    if (
      recorded.current ||
      !query.data ||
      query.data.products
        .length === 0
    ) {
      return;
    }

    recordImpression(
      strategy,
      query.data.products
        .length,
    );

    recorded.current = true;
  }, [
    query.data,
    recordImpression,
    strategy,
  ]);

  if (query.isPending) {
    return (
      <section
        aria-label="Loading recommendations"
        className="space-y-4"
      >
        <div className="h-7 w-56 animate-pulse rounded bg-muted" />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({
            length: limit,
          }).map((_, index) => (
            <div
              key={index}
              className="aspect-[0.78] animate-pulse rounded-3xl border bg-muted/40"
            />
          ))}
        </div>
      </section>
    );
  }

  if (
    query.isError ||
    !query.data ||
    query.data.products
      .length === 0
  ) {
    return null;
  }

  const displayTitle =
    titleOverride ??
    query.data.title;

  return (
    <section
      aria-label={
        displayTitle
      }
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold sm:text-2xl">
          {displayTitle}
        </h2>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
          {query.data.reason}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {query.data.products.map(
          (product) => (
            <div
              key={product.id}
              className="h-full"
              onClickCapture={() =>
                recordClick(
                  strategy,
                  product.id,
                )
              }
            >
              <ProductCard
                product={product}
              />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
