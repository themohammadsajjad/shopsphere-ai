import {
  getRecommendationScore,
  normalizedRating,
  priceSimilarity,
  relationScore,
  tagOverlap,
} from "@/features/recommendations/scoring";
import type { Product } from "@/types/product";
import type {
  RecommendationContext,
  RecommendationResult,
  RecommendationStrategy,
} from "@/types/recommendation";

function uniqueProducts(
  products: Product[],
) {
  const seen =
    new Set<number>();

  return products.filter(
    (product) => {
      if (
        seen.has(product.id)
      ) {
        return false;
      }

      seen.add(product.id);
      return true;
    },
  );
}

function take(
  products: Product[],
  limit: number,
) {
  return uniqueProducts(
    products,
  ).slice(0, limit);
}

function formatCategory(
  category: string,
) {
  return category
    .split("-")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function signalProducts(
  context: RecommendationContext,
) {
  return [
    ...context.signals
      .recentlyViewed,
    ...context.signals
      .wishlist,
    ...context.signals.cart,
    ...context.signals
      .purchases,
  ];
}

function dominantCategory(
  context: RecommendationContext,
) {
  const counts =
    new Map<
      string,
      number
    >();

  for (const product of signalProducts(
    context,
  )) {
    counts.set(
      product.category,
      (counts.get(
        product.category,
      ) ?? 0) + 1,
    );
  }

  for (const query of context
    .signals.searchHistory) {
    const normalized =
      query.toLowerCase();

    for (const product of context
      .products) {
      const label =
        product.category
          .replaceAll("-", " ")
          .toLowerCase();

      if (
        normalized.includes(
          label,
        )
      ) {
        counts.set(
          product.category,
          (counts.get(
            product.category,
          ) ?? 0) + 1,
        );
      }
    }
  }

  return [
    ...counts.entries(),
  ].sort(
    (a, b) =>
      b[1] - a[1],
  )[0]?.[0];
}

function popularityScore(
  product: Product,
) {
  const mockVelocity =
    ((product.id * 37) %
      100) /
    100;

  const discount =
    Math.min(
      product.discountPercentage /
        30,
      1,
    );

  return (
    normalizedRating(
      product,
    ) *
      0.6 +
    discount * 0.2 +
    mockVelocity * 0.2
  );
}

function sortByScore(
  products: Product[],
  score: (
    product: Product,
  ) => number,
) {
  return [...products].sort(
    (a, b) =>
      score(b) - score(a),
  );
}

function excludeIds(
  products: Product[],
  ids: number[],
) {
  const excluded =
    new Set(ids);

  return products.filter(
    (product) =>
      !excluded.has(
        product.id,
      ),
  );
}

function trending(
  context: RecommendationContext,
  limit: number,
): RecommendationResult {
  return {
    strategy: "trending",
    title:
      "Trending Products",
    reason:
      "Popular products ranked by rating, discount activity, and deterministic local popularity signals.",
    products: take(
      sortByScore(
        context.products,
        popularityScore,
      ),
      limit,
    ),
  };
}

export function runRecommendationStrategy(
  strategy: RecommendationStrategy,
  context: RecommendationContext,
  limit = 4,
): RecommendationResult {
  if (
    strategy ===
    "recently-viewed"
  ) {
    return {
      strategy,
      title:
        "Recently Viewed",
      reason:
        "Products you opened most recently on this device.",
      products: take(
        context.signals
          .recentlyViewed,
        limit,
      ),
    };
  }

  if (
    strategy === "trending"
  ) {
    return trending(
      context,
      limit,
    );
  }

  if (
    strategy ===
    "similar-products"
  ) {
    const seed =
      context.seedProduct;

    if (!seed) {
      return {
        strategy,
        title:
          "Similar Products",
        reason:
          "Open a product to see similarity-based recommendations.",
        products: [],
      };
    }

    const candidates =
      excludeIds(
        context.products,
        [seed.id],
      );

    return {
      strategy,
      title:
        "Similar Products",
      reason: `Products related to ${seed.title} by category, tags, price, and rating.`,
      products: take(
        sortByScore(
          candidates,
          (candidate) =>
            relationScore(
              candidate,
              [seed],
            ) *
              0.85 +
            normalizedRating(
              candidate,
            ) *
              0.15,
        ),
        limit,
      ),
    };
  }

  if (
    strategy ===
    "category-based"
  ) {
    const category =
      context.seedProduct
        ?.category ??
      dominantCategory(
        context,
      );

    if (!category) {
      const fallback =
        trending(
          context,
          limit,
        );

      return {
        ...fallback,
        strategy,
        title:
          "Popular Categories",
      };
    }

    return {
      strategy,
      title: `More from ${formatCategory(category)}`,
      reason:
        "Based on the product category you are currently viewing or browse most often.",
      products: take(
        sortByScore(
          context.products.filter(
            (product) =>
              product.category ===
                category &&
              product.id !==
                context
                  .seedProduct
                  ?.id,
          ),
          normalizedRating,
        ),
        limit,
      ),
    };
  }

  if (
    strategy ===
    "price-based"
  ) {
    const references =
      signalProducts(
        context,
      );

    if (
      references.length === 0
    ) {
      return {
        strategy,
        title:
          "Within Your Price Range",
        reason:
          "Browse a few products to build a typical price range.",
        products: [],
      };
    }

    return {
      strategy,
      title:
        "Within Your Price Range",
      reason:
        "Products closest to the price range suggested by your browsing, cart, wishlist, and purchases.",
      products: take(
        sortByScore(
          excludeIds(
            context.products,
            references.map(
              (item) =>
                item.id,
            ),
          ),
          (product) =>
            priceSimilarity(
              product,
              references,
            ) *
              0.8 +
            normalizedRating(
              product,
            ) *
              0.2,
        ),
        limit,
      ),
    };
  }

  if (
    strategy ===
    "wishlist-based"
  ) {
    const wishlist =
      context.signals
        .wishlist;

    return {
      strategy,
      title:
        "Because of Your Wishlist",
      reason:
        "Recommendations related to products you have saved.",
      products:
        wishlist.length === 0
          ? []
          : take(
              sortByScore(
                excludeIds(
                  context.products,
                  wishlist.map(
                    (item) =>
                      item.id,
                  ),
                ),
                (product) =>
                  relationScore(
                    product,
                    wishlist,
                  ) *
                    0.85 +
                  normalizedRating(
                    product,
                  ) *
                    0.15,
              ),
              limit,
            ),
    };
  }

  if (
    strategy === "cart-based"
  ) {
    const cart =
      context.signals.cart;

    return {
      strategy,
      title:
        "Complete Your Cart",
      reason:
        "Add-on products related to what is currently in your cart.",
      products:
        cart.length === 0
          ? []
          : take(
              sortByScore(
                excludeIds(
                  context.products,
                  cart.map(
                    (item) =>
                      item.id,
                  ),
                ),
                (product) =>
                  relationScore(
                    product,
                    cart,
                  ) *
                    0.8 +
                  normalizedRating(
                    product,
                  ) *
                    0.2,
              ),
              limit,
            ),
    };
  }

  if (
    strategy ===
    "frequently-bought-together"
  ) {
    const seed =
      context.seedProduct ??
      context.signals.cart[0] ??
      context.signals
        .recentlyViewed[0];

    if (!seed) {
      return {
        strategy,
        title:
          "Frequently Bought Together",
        reason:
          "A product signal is needed to build a mock co-occurrence set.",
        products: [],
      };
    }

    const candidates =
      excludeIds(
        context.products,
        [seed.id],
      );

    return {
      strategy,
      title:
        "Frequently Bought Together",
      reason: `Mock co-occurrence around ${seed.title}, favoring complementary tags and strong ratings.`,
      products: take(
        sortByScore(
          candidates,
          (product) => {
            const mockPair =
              ((seed.id * 31 +
                product.id *
                  17) %
                100) /
              100;

            const complementary =
              product.category !==
              seed.category
                ? 1
                : 0;

            return (
              tagOverlap(
                product,
                [seed],
              ) *
                0.4 +
              normalizedRating(
                product,
              ) *
                0.25 +
              mockPair * 0.2 +
              complementary *
                0.15
            );
          },
        ),
        limit,
      ),
    };
  }

  const excluded =
    signalProducts(
      context,
    ).map(
      (product) =>
        product.id,
    );

  const hasSignals =
    excluded.length > 0 ||
    context.signals
      .searchHistory.length >
      0;

  if (!hasSignals) {
    const fallback =
      trending(
        context,
        limit,
      );

    return {
      ...fallback,
      strategy:
        "personalized",
      title:
        "Popular Right Now",
      reason:
        "Personalized recommendations will replace this fallback as browsing signals become available.",
    };
  }

  return {
    strategy:
      "personalized",
    title:
      "Recommended For You",
    reason:
      "A weighted blend of category, price, tags, rating, recent views, wishlist, and cart signals.",
    products: take(
      sortByScore(
        excludeIds(
          context.products,
          excluded,
        ),
        (product) =>
          getRecommendationScore(
            product,
            context.signals,
          ).total,
      ),
      limit,
    ),
  };
}
