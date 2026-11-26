import { filterProducts } from "@/features/products/product-filters";
import type {
  Product,
  ProductFilters,
  ProductSortField,
  SortOrder,
} from "@/types/product";

type FilteredProductsPageParams = {
  products: Product[];
  filters: ProductFilters;
  page: number;
  limit: number;
  sortBy?: ProductSortField;
  order?: SortOrder;
};

function sortProducts(
  products: Product[],
  sortBy?: ProductSortField,
  order: SortOrder = "asc",
) {
  if (!sortBy) {
    return products;
  }

  const direction =
    order === "desc" ? -1 : 1;

  return [...products].sort(
    (first, second) => {
      if (sortBy === "title") {
        return (
          first.title.localeCompare(
            second.title,
          ) * direction
        );
      }

      if (sortBy === "createdAt") {
        const firstDate =
          Date.parse(
            first.meta.createdAt,
          ) || 0;

        const secondDate =
          Date.parse(
            second.meta.createdAt,
          ) || 0;

        return (
          (firstDate - secondDate) *
          direction
        );
      }

      const firstValue =
        first[sortBy];

      const secondValue =
        second[sortBy];

      if (
        typeof firstValue === "number" &&
        typeof secondValue === "number"
      ) {
        return (
          (firstValue - secondValue) *
          direction
        );
      }

      return 0;
    },
  );
}

export function getFilteredProductsPage({
  products,
  filters,
  page,
  limit,
  sortBy,
  order,
}: FilteredProductsPageParams) {
  const filteredProducts =
    filterProducts(
      products,
      filters,
    );

  const sortedProducts =
    sortProducts(
      filteredProducts,
      sortBy,
      order,
    );

  const safePage =
    Math.max(1, page);

  const safeLimit =
    Math.max(1, limit);

  const start =
    (safePage - 1) * safeLimit;

  return {
    products: sortedProducts.slice(
      start,
      start + safeLimit,
    ),
    total: sortedProducts.length,
    page: safePage,
    limit: safeLimit,
  };
}
