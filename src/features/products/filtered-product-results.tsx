"use client";

import { Button } from "@/components/ui/button";
import { ActiveFilterChips } from "@/features/products/active-filter-chips";
import { getFilteredProductsPage } from "@/features/products/filtered-products";
import { countActiveProductFilters } from "@/features/products/product-filters";
import { ProductFilterPanel } from "@/features/products/product-filter-panel";
import { ProductGrid } from "@/features/products/product-grid";
import { ProductPagination } from "@/features/products/product-pagination";
import {
  useProductCategoriesQuery,
  useProductsQuery,
} from "@/features/products/queries";
import type {
  ProductFilters,
  ProductListParams,
} from "@/types/product";

type FilteredProductResultsProps = {
  params?: ProductListParams;
  filters: ProductFilters;
  page: number;
  limit?: number;
  onFiltersChange: (
    filters: ProductFilters,
  ) => void;
  onPageChange: (page: number) => void;
};

function LoadingGrid() {
  return (
    <div
      className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Loading products"
      role="status"
    >
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border"
        >
          <div className="aspect-square animate-pulse bg-muted" />

          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FilteredProductResults({
  params = {},
  filters,
  page,
  limit = 12,
  onFiltersChange,
  onPageChange,
}: FilteredProductResultsProps) {
  const productsQuery = useProductsQuery({
    ...params,
    limit: 0,
    skip: 0,
  });

  const categoriesQuery =
    useProductCategoriesQuery();

  if (productsQuery.isPending) {
    return <LoadingGrid />;
  }

  if (productsQuery.isError) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h2 className="text-xl font-semibold">
          Products could not be loaded
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Check your connection and try loading
          the product catalog again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() =>
            productsQuery.refetch()
          }
        >
          Retry
        </Button>
      </section>
    );
  }

  const candidateProducts =
    productsQuery.data.products;

  const brands = [
    ...new Set(
      candidateProducts
        .map((product) => product.brand)
        .filter(
          (brand): brand is string =>
            Boolean(brand),
        ),
    ),
  ].sort((a, b) =>
    a.localeCompare(b),
  );

  const prices = candidateProducts.map(
    (product) => product.price,
  );

  const priceBounds =
    prices.length > 0
      ? {
          min: Math.floor(
            Math.min(...prices),
          ),
          max: Math.ceil(
            Math.max(...prices),
          ),
        }
      : {
          min: 0,
          max: 5000,
        };

  const filteredResult =
    getFilteredProductsPage({
      products: candidateProducts,
      filters,
      page,
      limit,
    });

  const activeFilterCount =
    countActiveProductFilters(filters);

  const categories =
    categoriesQuery.data ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
      <div className="lg:sticky lg:top-6">
        <ProductFilterPanel
          filters={filters}
          brands={brands}
          categories={categories}
          priceBounds={priceBounds}
          onFiltersChange={
            onFiltersChange
          }
        />
      </div>

      <div className="min-w-0 space-y-6">
        <ActiveFilterChips
          filters={filters}
          categories={categories}
          onFiltersChange={
            onFiltersChange
          }
        />

        {filteredResult.total === 0 ? (
          <section className="glass-panel rounded-3xl border p-8 text-center">
            <h2 className="text-xl font-semibold">
              {activeFilterCount > 0
                ? "No products match these filters"
                : "No products found"}
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {activeFilterCount > 0
                ? "The active filters shown above produced zero matching products. Remove a filter or clear them all to continue browsing."
                : params.search
                  ? `We could not find products matching "${params.search}". Try a shorter or different search term.`
                  : "Try another category or search term."}
            </p>

            {activeFilterCount > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={() =>
                  onFiltersChange({
                    brands: [],
                    categories: [],
                  })
                }
              >
                Clear Filters
              </Button>
            ) : null}
          </section>
        ) : (
          <>
            <ProductGrid
              products={
                filteredResult.products
              }
              total={filteredResult.total}
              isUpdating={
                productsQuery.isFetching
              }
              isPlaceholderData={
                productsQuery.isPlaceholderData
              }
            />

            <ProductPagination
              page={page}
              total={filteredResult.total}
              limit={limit}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
