"use client";

import { RecommendationRail } from "@/features/recommendations/recommendation-rail";
import type { Product } from "@/types/product";

export function ProductRecommendations({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="space-y-10">
      <RecommendationRail
        strategy="category-based"
        seedProduct={product}
        titleOverride="Related Products"
      />

      <RecommendationRail
        strategy="similar-products"
        seedProduct={product}
      />

      <RecommendationRail
        strategy="frequently-bought-together"
        seedProduct={product}
      />

      <RecommendationRail
        strategy="personalized"
        seedProduct={product}
      />
    </div>
  );
}
