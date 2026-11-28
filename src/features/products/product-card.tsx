"use client";

import {
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";
import { formatInr } from "@/utils/currency";

type ProductCardProps = {
  product: Product;
  isCompared?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: () => void;
  onQuickView?: () => void;
};

function formatCategory(
  category: string,
) {
  return category
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export function ProductCard({
  product,
  isCompared = false,
  compareDisabled = false,
  onToggleCompare,
  onQuickView,
}: ProductCardProps) {
  const productIds =
    useWishlistStore(
      (state) => state.productIds,
    );

  const hasHydrated =
    useSyncExternalStore(
      (onStoreChange) =>
        useWishlistStore.persist.onFinishHydration(
          onStoreChange,
        ),
      () =>
        useWishlistStore.persist.hasHydrated(),
      () => false,
    );

  const toggleProduct =
    useWishlistStore(
      (state) => state.toggleProduct,
    );

  const isWishlisted =
    hasHydrated &&
    productIds.includes(product.id);

  const isLowStock =
    product.stock > 0 &&
    product.stock <= 5;

  const isOutOfStock =
    product.stock <= 0;

  return (
    <article className="glass-panel group flex h-full flex-col overflow-hidden rounded-3xl border">
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] sm:p-5"
        />

        {product.discountPercentage >
        0 ? (
          <span className="absolute left-3 top-3 rounded-full border bg-background/90 px-2 py-1 text-[11px] font-medium backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            {product.discountPercentage.toFixed(
              0,
            )}
            % off
          </span>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-background/90 p-0 backdrop-blur sm:right-4 sm:top-4"
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={
            isWishlisted
          }
          onClick={() =>
            toggleProduct(product.id)
          }
        >
          <span aria-hidden="true">
            {isWishlisted
              ? "♥"
              : "♡"}
          </span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col space-y-3 p-3 sm:space-y-4 sm:p-5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-xs sm:tracking-[0.14em]">
            {formatCategory(
              product.category,
            )}
          </p>

          <h2 className="mt-2 line-clamp-2 text-sm font-semibold tracking-tight sm:text-lg">
            <Link
              href={`/products/${product.id}`}
              className="hover:underline"
            >
              {product.title}
            </Link>
          </h2>

          {product.brand ? (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:text-sm">
              {product.brand}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-base font-semibold sm:text-xl">
            {formatInr(
              product.price,
            )}
          </p>

          <p
            className="text-xs text-muted-foreground sm:text-sm"
            aria-label={`Rated ${product.rating} out of 5`}
          >
            ★{" "}
            {product.rating.toFixed(
              1,
            )}
          </p>
        </div>

        <div className="mt-auto border-t pt-3 sm:pt-4">
          {isOutOfStock ? (
            <p className="text-xs font-medium text-destructive sm:text-sm">
              Out of stock
            </p>
          ) : isLowStock ? (
            <p className="text-xs font-medium sm:text-sm">
              Only {product.stock} left
            </p>
          ) : (
            <p className="text-xs text-muted-foreground sm:text-sm">
              {
                product.availabilityStatus
              }
            </p>
          )}
        </div>

        {onQuickView ||
        onToggleCompare ? (
          <div className="grid gap-2">
            {onQuickView ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={
                  onQuickView
                }
              >
                Quick view
              </Button>
            ) : null}

            {onToggleCompare ? (
              <Button
                type="button"
                variant={
                  isCompared
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="w-full"
                aria-pressed={
                  isCompared
                }
                disabled={
                  compareDisabled
                }
                onClick={
                  onToggleCompare
                }
              >
                {isCompared
                  ? "Selected"
                  : "Compare"}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
