import { filterProducts } from "@/features/products/product-filters";
import type {
  Product,
  ProductFilters,
} from "@/types/product";

type FilteredProductsPageParams = {
  products: Product[];
  filters: ProductFilters;
  page: number;
  limit: number;
};

export function getFilteredProductsPage({
  products,
  filters,
  page,
  limit,
}: FilteredProductsPageParams) {
  const filteredProducts = filterProducts(
    products,
    filters,
  );

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);

  const start =
    (safePage - 1) * safeLimit;

  return {
    products: filteredProducts.slice(
      start,
      start + safeLimit,
    ),
    total: filteredProducts.length,
    page: safePage,
    limit: safeLimit,
  };
}
