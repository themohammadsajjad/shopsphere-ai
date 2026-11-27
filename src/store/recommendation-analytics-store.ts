"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { RecommendationStrategy } from "@/types/recommendation";

type StrategyCounts =
  Partial<
    Record<
      RecommendationStrategy,
      number
    >
  >;

type RecommendationAnalyticsState = {
  impressions: StrategyCounts;
  clicks: StrategyCounts;
  conversions: StrategyCounts;
  clickedProducts: Record<number, RecommendationStrategy>;
  recordImpression: (
    strategy: RecommendationStrategy,
    count?: number,
  ) => void;
  recordClick: (
    strategy: RecommendationStrategy,
    productId?: number,
  ) => void;

  recordConversion: (
    productId: number,
  ) => void;
  resetAnalytics: () => void;
};

export const useRecommendationAnalyticsStore =
  create<RecommendationAnalyticsState>()(
    persist(
      (set) => ({
        impressions: {},
        clicks: {},
        conversions: {},
        clickedProducts: {},

        recordImpression: (
          strategy,
          count = 1,
        ) =>
          set((state) => ({
            impressions: {
              ...state.impressions,
              [strategy]:
                (state
                  .impressions[
                  strategy
                ] ?? 0) +
                count,
            },
          })),

        recordClick: (
          strategy,
          productId,
        ) =>
          set((state) => ({
            clicks: {
              ...state.clicks,
              [strategy]:
                (state.clicks[
                  strategy
                ] ?? 0) + 1,
            },
            clickedProducts:
              productId ===
              undefined
                ? state.clickedProducts
                : {
                    ...state.clickedProducts,
                    [productId]:
                      strategy,
                  },
          })),

        recordConversion:
          (productId) =>
            set((state) => {
              const strategy =
                state.clickedProducts[
                  productId
                ];

              if (!strategy) {
                return state;
              }

              return {
                conversions: {
                  ...state.conversions,
                  [strategy]:
                    (state.conversions[
                      strategy
                    ] ?? 0) + 1,
                },
              };
            }),

        resetAnalytics: () =>
          set({
            impressions: {},
            clicks: {},
            conversions: {},
            clickedProducts: {},
          }),
      }),
      {
        name:
          "shopsphere-recommendation-analytics",
      },
    ),
  );
