"use client";

import {
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/products/product-card";
import { ProductComparison } from "@/features/products/product-comparison";
import { ProductQuickView } from "@/features/products/product-quick-view";
import type { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[];
  total: number;
  isUpdating?: boolean;
  isPlaceholderData?: boolean;
};

export function ProductGrid({
  products,
  total,
  isUpdating = false,
  isPlaceholderData = false,
}: ProductGridProps) {
  const [
    quickViewProduct,
    setQuickViewProduct,
  ] =
    useState<Product | null>(
      null,
    );

  const [
    compareProducts,
    setCompareProducts,
  ] = useState<Product[]>([]);

  const [
    isComparisonOpen,
    setIsComparisonOpen,
  ] = useState(false);

  function toggleCompare(
    product: Product,
  ) {
    setCompareProducts(
      (current) => {
        const exists =
          current.some(
            (item) =>
              item.id === product.id,
          );

        if (exists) {
          return current.filter(
            (item) =>
              item.id !== product.id,
          );
        }

        if (current.length >= 4) {
          return current;
        }

        return [
          ...current,
          product,
        ];
      },
    );
  }

  return (
    <>
      <section
        aria-label="Product results"
        className={
          isPlaceholderData
            ? "opacity-60 transition-opacity"
            : "transition-opacity"
        }
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {total} products found
            </p>

            {compareProducts.length >
            0 ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {
                  compareProducts.length
                }
                /4 selected for
                comparison
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {isUpdating ? (
              <p
                className="text-xs text-muted-foreground"
                role="status"
              >
                Updating results...
              </p>
            ) : null}

            {compareProducts.length >
            0 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  compareProducts.length <
                  2
                }
                onClick={() =>
                  setIsComparisonOpen(
                    true,
                  )
                }
              >
                Compare selected (
                {
                  compareProducts.length
                }
                )
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(
            (product) => {
              const isCompared =
                compareProducts.some(
                  (item) =>
                    item.id ===
                    product.id,
                );

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCompared={
                    isCompared
                  }
                  compareDisabled={
                    !isCompared &&
                    compareProducts.length >=
                      4
                  }
                  onQuickView={() =>
                    setQuickViewProduct(
                      product,
                    )
                  }
                  onToggleCompare={() =>
                    toggleCompare(
                      product,
                    )
                  }
                />
              );
            },
          )}
        </div>
      </section>

      <ProductQuickView
        product={quickViewProduct}
        onClose={() =>
          setQuickViewProduct(
            null,
          )
        }
      />

      {isComparisonOpen ? (
        <ProductComparison
          products={
            compareProducts
          }
          onClose={() =>
            setIsComparisonOpen(
              false,
            )
          }
        />
      ) : null}
    </>
  );
}
