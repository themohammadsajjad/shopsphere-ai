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
  recordImpression: (
    strategy: RecommendationStrategy,
    count?: number,
  ) => void;
  recordClick: (
    strategy: RecommendationStrategy,
  ) => void;
  resetAnalytics: () => void;
};

export const useRecommendationAnalyticsStore =
  create<RecommendationAnalyticsState>()(
    persist(
      (set) => ({
        impressions: {},
        clicks: {},

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
        ) =>
          set((state) => ({
            clicks: {
              ...state.clicks,
              [strategy]:
                (state.clicks[
                  strategy
                ] ?? 0) + 1,
            },
          })),

        resetAnalytics: () =>
          set({
            impressions: {},
            clicks: {},
          }),
      }),
      {
        name:
          "shopsphere-recommendation-analytics",
      },
    ),
  );
