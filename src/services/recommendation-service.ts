import { getRecentSearches } from "@/features/products/search-history";
import { mockRecommendationProvider } from "@/features/recommendations/recommendation-provider";
import { getProducts } from "@/services/product-service";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useWishlistStore } from "@/store/wishlist-store";
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
