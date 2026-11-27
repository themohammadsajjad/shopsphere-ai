"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeliveryEstimate } from "@/features/products/delivery-estimate";
import { ProductGallery } from "@/features/products/product-gallery";
import { ProductInfoTabs } from "@/features/products/product-info-tabs";
import { ProductPurchasePanel } from "@/features/products/product-purchase-panel";
import { ProductRecommendations } from "@/features/recommendations/product-recommendations";
import { ProductViewTracker } from "@/features/recommendations/product-view-tracker";
import { ProductReviews } from "@/features/products/product-reviews";
import { useProductQuery } from "@/features/products/queries";
import { ProductServiceError } from "@/services/product-service";

type ProductDetailProps = {
  productId: number;
};

function LoadingProductDetail() {
  return (
    <div
      role="status"
      aria-label="Loading product details"
      className="space-y-8"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl border bg-muted/40" />

        <div className="h-[34rem] animate-pulse rounded-3xl border bg-muted/40" />
      </div>

      <div className="h-56 animate-pulse rounded-3xl border bg-muted/40" />
    </div>
  );
}

export function ProductDetail({
  productId,
}: ProductDetailProps) {
  const productQuery =
    useProductQuery(productId);

  if (
    !Number.isInteger(
      productId,
    ) ||
    productId <= 0
  ) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h1 className="text-2xl font-semibold">
          Product not available
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The product link is
          invalid.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() =>
            history.back()
          }
        >
          Go back
        </Button>
      </section>
    );
  }

  if (productQuery.isPending) {
    return (
      <LoadingProductDetail />
    );
  }

  if (productQuery.isError) {
    const noLongerAvailable =
      productQuery.error instanceof
        ProductServiceError &&
      productQuery.error.status ===
        404;

    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h1 className="text-2xl font-semibold">
          {noLongerAvailable
            ? "Product no longer available"
            : "Product could not be loaded"}
        </h1>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          {noLongerAvailable
            ? "This product is no longer returned by the catalogue."
            : "Check your connection and try loading this product again."}
        </p>

        {!noLongerAvailable ? (
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() =>
              productQuery.refetch()
            }
          >
            Retry
          </Button>
        ) : (
          <Link
            href="/products"
            className="mt-5 inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium"
          >
            Browse products
          </Link>
        )}
      </section>
    );
  }

  const product =
    productQuery.data;

  return (
    <div className="space-y-10">
      <ProductViewTracker product={product} />
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          href="/products"
          className="hover:text-foreground"
        >
          Products
        </Link>

        <span>/</span>

        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-foreground"
        >
          {product.category}
        </Link>

        <span>/</span>

        <span className="text-foreground">
          {product.title}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <ProductGallery
          product={product}
        />

        <ProductPurchasePanel
          product={product}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)]">
        <ProductInfoTabs
          product={product}
        />

        <DeliveryEstimate />
      </div>

      <ProductReviews
        rating={product.rating}
        reviews={product.reviews}
      />

      <ProductRecommendations product={product} />
    </div>
  );
}
