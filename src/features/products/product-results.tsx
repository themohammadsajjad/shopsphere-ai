"use client";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/features/products/product-grid";
import { ProductPagination } from "@/features/products/product-pagination";
import { useProductsQuery } from "@/features/products/queries";
import type { ProductListParams } from "@/types/product";

type ProductResultsProps = {
  params?: ProductListParams;
  onPageChange: (page: number) => void;
};

function ProductResultsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Loading products"
      role="status"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border"
        >
          <div className="aspect-square animate-pulse bg-muted" />

          <div className="space-y-3 p-5">
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

export function ProductResults({
  params = {},
  onPageChange,
}: ProductResultsProps) {
  const productsQuery = useProductsQuery(params);

  if (productsQuery.isPending) {
    return <ProductResultsSkeleton />;
  }

  if (productsQuery.isError) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h2 className="text-xl font-semibold">
          Products could not be loaded
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Check your connection and try loading the product catalog again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => productsQuery.refetch()}
        >
          Retry
        </Button>
      </section>
    );
  }

  const data = productsQuery.data;
  const products = data.products;

  if (products.length === 0) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h2 className="text-xl font-semibold">
          No products found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Try another search term or adjust your selected filters.
        </p>
      </section>
    );
  }

  const limit = params.limit ?? 12;
  const skip = params.skip ?? 0;
  const page = Math.floor(skip / limit) + 1;

  return (
    <div className="space-y-6">
      <ProductGrid
        products={products}
        total={data.total}
        isUpdating={productsQuery.isFetching}
        isPlaceholderData={
          productsQuery.isPlaceholderData
        }
      />

      <ProductPagination
        page={page}
        total={data.total}
        limit={limit}
        onPageChange={onPageChange}
      />
    </div>
  );
}
