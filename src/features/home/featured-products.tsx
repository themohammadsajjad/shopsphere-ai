"use client";

import { ProductCard } from "@/features/products/product-card";
import { useProductsQuery } from "@/features/products/queries";

export function FeaturedProducts() {
  const query =
    useProductsQuery({
      limit: 4,
      skip: 0,
      sortBy: "rating",
      order: "desc",
    });

  if (query.isPending) {
    return (
      <section
        aria-label="Featured Products"
        className="mb-12"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">
          Featured Products
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="aspect-[0.78] animate-pulse rounded-3xl border bg-muted/40"
              />
            ),
          )}
        </div>
      </section>
    );
  }

  if (
    query.isError ||
    query.data.products.length ===
      0
  ) {
    return null;
  }

  return (
    <section
      aria-label="Featured Products"
      className="mb-12"
    >
      <h2 className="text-xl font-semibold sm:text-2xl">
        Featured Products
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Highly rated products from
        across the catalogue.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {query.data.products.map(
          (product) => (
            <ProductCard
              key={
                product.id
              }
              product={
                product
              }
            />
          ),
        )}
      </div>
    </section>
  );
}
