import { getRecentSearches } from "@/features/products/search-history";
import { mockRecommendationProvider } from "@/features/recommendations/recommendation-provider";
import { getProducts } from "@/services/product-service";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { filterProducts } from "@/features/products/product-filters";
import type { AssistantIntent } from "@/types/assistant";
import type { Product } from "@/types/product";
import type {
  RecommendationRequest,
  RecommendationSignals,
} from "@/types/recommendation";

function productsForIds(
  products: Product[],
  ids: number[],
) {
  const byId =
    new Map(
      products.map(
        (product) => [
          product.id,
          product,
        ],
      ),
    );

  return ids
    .map((id) => byId.get(id))
    .filter(
      (
        product,
      ): product is Product =>
        Boolean(product),
    );
}

export async function getRecommendations(
  request: RecommendationRequest,
) {
  const response =
    await getProducts({
      limit: 200,
      skip: 0,
    });

  const products =
    response.products;

  const recent =
    useRecentlyViewedStore.getState()
      .products;

  const wishlistIds =
    useWishlistStore.getState()
      .productIds;

  const cartItems =
    useCartStore.getState()
      .items;

  const orders =
    useOrderStore.getState()
      .orders;

  const purchaseIds =
    orders.flatMap(
      (order) =>
        order.items.map(
          (item) =>
            item.productId,
        ),
    );

  const signals: RecommendationSignals =
    {
      recentlyViewed:
        recent,
      searchHistory:
        getRecentSearches(),
      wishlist:
        productsForIds(
          products,
          wishlistIds,
        ),
      cart:
        productsForIds(
          products,
          cartItems.map(
            (item) =>
              item.productId,
          ),
        ),
      purchases:
        productsForIds(
          products,
          purchaseIds,
        ),
    };

  return mockRecommendationProvider.getRecommendations(
    request,
    {
      products,
      signals,
      seedProduct:
        request.seedProduct,
    },
  );
}


const ASSISTANT_CATEGORY_TERMS:
  Record<string, string[]> = {
    headphones: [
      "headphone",
      "headphones",
      "earbud",
      "earbuds",
      "earphone",
      "earphones",
      "audio",
    ],
    smartphones: [
      "smartphone",
      "smartphones",
      "phone",
      "phones",
      "mobile",
    ],
    laptops: [
      "laptop",
      "laptops",
      "notebook",
    ],
    shoes: [
      "shoe",
      "shoes",
      "sneaker",
      "sneakers",
    ],
    watches: [
      "watch",
      "watches",
      "wearable",
    ],
    beauty: [
      "beauty",
      "makeup",
      "cosmetic",
    ],
    fragrances: [
      "fragrance",
      "perfume",
    ],
    furniture: [
      "furniture",
      "chair",
      "table",
    ],
  };

function assistantSearchText(
  product: Product,
) {
  return [
    product.title,
    product.category,
    product.brand ?? "",
    product.description,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesAssistantCategory(
  product: Product,
  category: string,
) {
  const searchable =
    assistantSearchText(
      product,
    );

  const terms =
    ASSISTANT_CATEGORY_TERMS[
      category
    ] ?? [category];

  return terms.some(
    (term) =>
      searchable.includes(
        term.toLowerCase(),
      ),
  );
}

export async function findProductsForAssistant(
  intent: AssistantIntent,
  limit = 6,
) {
  const response =
    await getProducts({
      limit: 200,
      skip: 0,
    });

  let products =
    filterProducts(
      response.products,
      {
        minPrice:
          intent.minPrice,
        maxPrice:
          intent.maxPrice,
        minRating:
          intent.minRating,
        brands: [],
        categories: [],
      },
    );

  if (intent.category) {
    products =
      products.filter(
        (product) =>
          matchesAssistantCategory(
            product,
            intent.category!,
          ),
      );
  }

  if (intent.color) {
    const color =
      intent.color.toLowerCase();

    products =
      products.filter(
        (product) =>
          assistantSearchText(
            product,
          ).includes(color),
      );
  }

  return [...products]
    .sort(
      (a, b) =>
        b.rating -
          a.rating ||
        a.price -
          b.price,
    )
    .slice(0, limit);
}
