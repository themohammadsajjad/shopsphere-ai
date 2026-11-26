import type {
  Product,
  ProductFilters,
} from "@/types/product";

export const EMPTY_PRODUCT_FILTERS: ProductFilters = {
  brands: [],
  categories: [],
};

export function normalizeProductFilters(
  filters: ProductFilters,
): ProductFilters {
  let minPrice = filters.minPrice;
  let maxPrice = filters.maxPrice;

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice > maxPrice
  ) {
    [minPrice, maxPrice] = [
      maxPrice,
      minPrice,
    ];
  }

  return {
    minPrice,
    maxPrice,
    minRating: filters.minRating,
    availability: filters.availability,
    onSale: filters.onSale,
    brands: [...new Set(filters.brands)],
    categories: [
      ...new Set(filters.categories),
    ],
  };
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
) {
  const normalized =
    normalizeProductFilters(filters);

  return products.filter((product) => {
    if (
      normalized.minPrice !== undefined &&
      product.price < normalized.minPrice
    ) {
      return false;
    }

    if (
      normalized.maxPrice !== undefined &&
      product.price > normalized.maxPrice
    ) {
      return false;
    }

    if (
      normalized.minRating !== undefined &&
      product.rating < normalized.minRating
    ) {
      return false;
    }

    if (
      normalized.availability === "in-stock" &&
      product.stock <= 0
    ) {
      return false;
    }

    if (
      normalized.availability ===
        "out-of-stock" &&
      product.stock > 0
    ) {
      return false;
    }

    if (
      normalized.onSale &&
      product.discountPercentage <= 0
    ) {
      return false;
    }

    if (
      normalized.brands.length > 0 &&
      (!product.brand ||
        !normalized.brands.includes(
          product.brand,
        ))
    ) {
      return false;
    }

    if (
      normalized.categories.length > 0 &&
      !normalized.categories.includes(
        product.category,
      )
    ) {
      return false;
    }

    return true;
  });
}

export function countActiveProductFilters(
  filters: ProductFilters,
) {
  const normalized =
    normalizeProductFilters(filters);

  return [
    normalized.minPrice !== undefined,
    normalized.maxPrice !== undefined,
    normalized.minRating !== undefined,
    normalized.availability !== undefined,
    normalized.onSale === true,
    normalized.brands.length > 0,
    normalized.categories.length > 0,
  ].filter(Boolean).length;
}
