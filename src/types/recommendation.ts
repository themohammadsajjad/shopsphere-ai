import type { Product } from "@/types/product";

export type RecommendationStrategy =
  | "recently-viewed"
  | "similar-products"
  | "category-based"
  | "price-based"
  | "wishlist-based"
  | "cart-based"
  | "frequently-bought-together"
  | "trending"
  | "personalized";

export interface RecommendationSignals {
  recentlyViewed: Product[];
  searchHistory: string[];
  wishlist: Product[];
  cart: Product[];
  purchases: Product[];
}

export interface RecommendationRequest {
  strategy: RecommendationStrategy;
  seedProduct?: Product;
  limit?: number;
}

export interface RecommendationContext {
  products: Product[];
  signals: RecommendationSignals;
  seedProduct?: Product;
}

export interface RecommendationScore {
  categoryMatch: number;
  priceSimilarity: number;
  tagOverlap: number;
  rating: number;
  recentRelation: number;
  wishlistRelation: number;
  cartRelation: number;
  total: number;
}

export interface RecommendationResult {
  strategy: RecommendationStrategy;
  title: string;
  reason: string;
  products: Product[];
}
