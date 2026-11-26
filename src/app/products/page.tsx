import { Suspense } from "react";

import { ProductDiscovery } from "@/features/products/product-discovery";

function ProductDiscoveryFallback() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-label="Loading product discovery"
    >
      <div className="glass-panel h-40 animate-pulse rounded-3xl border" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[0.78] animate-pulse rounded-3xl border bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            ShopSphere AI
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover products
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Search, filter, sort, and explore products with a responsive
            discovery experience.
          </p>
        </div>

        <Suspense fallback={<ProductDiscoveryFallback />}>
          <ProductDiscovery />
        </Suspense>
      </section>
    </main>
  );
}
