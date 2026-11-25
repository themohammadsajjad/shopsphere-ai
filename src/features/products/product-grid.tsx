"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/products/product-card";
import { useProductsQuery } from "@/features/products/queries";
import type { ProductListParams } from "@/types/product";

type ProductGridProps = {
  params?: ProductListParams;
};

function ProductGridSkeleton() {
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

export function ProductGrid({
  params = {},
}: ProductGridProps) {
  const productsQuery = useProductsQuery(params);

  if (productsQuery.isPending) {
    return <ProductGridSkeleton />;
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

  const products = productsQuery.data?.products ?? [];

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

  return (
    <section
      aria-label="Product results"
      className={
        productsQuery.isPlaceholderData
          ? "opacity-60 transition-opacity"
          : "transition-opacity"
      }
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {productsQuery.data.total} products found
        </p>

        {productsQuery.isFetching ? (
          <p
            className="text-xs text-muted-foreground"
            role="status"
          >
            Updating results...
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
