"use client";

import { RecommendationRail } from "@/features/recommendations/recommendation-rail";

export function HomeRecommendations() {
  return (
    <div className="space-y-12">
      <RecommendationRail
        strategy="trending"
      />

      <RecommendationRail
        strategy="recently-viewed"
      />

      <RecommendationRail
        strategy="price-based"
      />

      <RecommendationRail
        strategy="personalized"
      />
    </div>
  );
}
