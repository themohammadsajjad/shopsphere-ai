import type { Product } from "@/types/product";
import type {
  RecommendationScore,
  RecommendationSignals,
} from "@/types/recommendation";

function clamp01(value: number) {
  return Math.max(
    0,
    Math.min(1, value),
  );
}

export function normalizedRating(
  product: Product,
) {
  return clamp01(
    product.rating / 5,
  );
}

export function priceSimilarity(
  product: Product,
  referenceProducts: Product[],
) {
  if (
    referenceProducts.length ===
    0
  ) {
    return 0;
  }

  const average =
    referenceProducts.reduce(
      (total, item) =>
        total + item.price,
      0,
    ) /
    referenceProducts.length;

  if (average <= 0) {
    return 0;
  }

  return clamp01(
    1 -
      Math.abs(
        product.price -
          average,
      ) /
        average,
  );
}

export function tagOverlap(
  product: Product,
  referenceProducts: Product[],
) {
  if (
    referenceProducts.length ===
    0
  ) {
    return 0;
  }

  const tags = new Set(
    referenceProducts.flatMap(
      (item) =>
        item.tags.map((tag) =>
          tag.toLowerCase(),
        ),
    ),
  );

  if (tags.size === 0) {
    return 0;
  }

  const matches =
    product.tags.filter((tag) =>
      tags.has(
        tag.toLowerCase(),
      ),
    ).length;

  return clamp01(
    matches /
      Math.max(
        product.tags.length,
        1,
      ),
  );
}

export function categoryMatch(
  product: Product,
  referenceProducts: Product[],
  searchHistory: string[] = [],
) {
  const productCategory =
    product.category.toLowerCase();

  const categorySignal =
    referenceProducts.some(
      (item) =>
        item.category.toLowerCase() ===
        productCategory,
    )
      ? 1
      : 0;

  const searchSignal =
    searchHistory.some(
      (query) => {
        const normalized =
          query.toLowerCase();

        return (
          normalized.includes(
            productCategory.replaceAll(
              "-",
              " ",
            ),
          ) ||
          product.tags.some(
            (tag) =>
              normalized.includes(
                tag.toLowerCase(),
              ),
          )
        );
      },
    )
      ? 1
      : 0;

  return Math.max(
    categorySignal,
    searchSignal,
  );
}

export function relationScore(
  product: Product,
  referenceProducts: Product[],
) {
  if (
    referenceProducts.length ===
    0
  ) {
    return 0;
  }

  return Math.max(
    ...referenceProducts.map(
      (reference) => {
        const category =
          product.category ===
          reference.category
            ? 1
            : 0;

        const price =
          priceSimilarity(
            product,
            [reference],
          );

        const tags =
          tagOverlap(
            product,
            [reference],
          );

        return (
          category * 0.45 +
          tags * 0.35 +
          price * 0.2
        );
      },
    ),
  );
}

export function getRecommendationScore(
  product: Product,
  signals: RecommendationSignals,
): RecommendationScore {
  const behaviorProducts = [
    ...signals.recentlyViewed,
    ...signals.wishlist,
    ...signals.cart,
    ...signals.purchases,
  ];

  const components = {
    categoryMatch:
      categoryMatch(
        product,
        behaviorProducts,
        signals.searchHistory,
      ),
    priceSimilarity:
      priceSimilarity(
        product,
        behaviorProducts,
      ),
    tagOverlap:
      tagOverlap(
        product,
        behaviorProducts,
      ),
    rating:
      normalizedRating(
        product,
      ),
    recentRelation:
      relationScore(
        product,
        signals.recentlyViewed,
      ),
    wishlistRelation:
      relationScore(
        product,
        signals.wishlist,
      ),
    cartRelation:
      relationScore(
        product,
        signals.cart,
      ),
  };

  // All components are normalized to 0–1 before weighting.
  const total =
    components.categoryMatch *
      0.22 +
    components.priceSimilarity *
      0.15 +
    components.tagOverlap *
      0.18 +
    components.rating *
      0.15 +
    components.recentRelation *
      0.1 +
    components.wishlistRelation *
      0.1 +
    components.cartRelation *
      0.1;

  return {
    ...components,
    total,
  };
}
