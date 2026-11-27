"use client";

import {
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getProductVariants } from "@/features/products/product-variants";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type {
  Product,
  ProductVariant,
} from "@/types/product";
import { formatInr } from "@/utils/currency";

type ProductPurchasePanelProps = {
  product: Product;
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

function getOriginalPrice(
  product: Product,
) {
  if (
    product.discountPercentage <= 0 ||
    product.discountPercentage >= 100
  ) {
    return undefined;
  }

  return (
    product.price /
    (1 -
      product.discountPercentage /
        100)
  );
}

export function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const router = useRouter();

  const variants = useMemo(
    () =>
      getProductVariants(product),
    [product],
  );

  const [
    selectedVariant,
    setSelectedVariant,
  ] =
    useState<ProductVariant | null>(
      variants[0] ?? null,
    );

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  const addItem =
    useCartStore(
      (state) => state.addItem,
    );

  const productIds =
    useWishlistStore(
      (state) => state.productIds,
    );

  const toggleProduct =
    useWishlistStore(
      (state) => state.toggleProduct,
    );

  const wishlistHydrated =
    useSyncExternalStore(
      (onStoreChange) =>
        useWishlistStore.persist.onFinishHydration(
          onStoreChange,
        ),
      () =>
        useWishlistStore.persist.hasHydrated(),
      () => false,
    );

  const isWishlisted =
    wishlistHydrated &&
    productIds.includes(
      product.id,
    );

  const availableStock =
    selectedVariant
      ? selectedVariant.stock
      : product.stock;

  const unavailable =
    availableStock <= 0;

  const originalPrice =
    getOriginalPrice(product);

  function selectVariant(
    variant: ProductVariant,
  ) {
    setSelectedVariant(
      variant,
    );

    setQuantity((current) =>
      variant.stock > 0
        ? Math.min(
            current,
            variant.stock,
          )
        : 1,
    );

    setAdded(false);
  }

  function addToCart() {
    if (unavailable) {
      return;
    }

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      thumbnail:
        product.thumbnail,
      quantity,
      stock:
        availableStock,
      variantId:
        selectedVariant?.id,
      variantLabel:
        selectedVariant?.label,
    });

    setAdded(true);
  }

  function buyNow() {
    if (unavailable) {
      return;
    }

    addToCart();
    router.push("/checkout");
  }

  return (
    <section className="glass-panel rounded-3xl border p-5 sm:p-7">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {formatCategory(
          product.category,
        )}
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {product.title}
      </h1>

      {product.brand ? (
        <p className="mt-2 text-sm text-muted-foreground">
          by {product.brand}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span
          aria-label={`Rated ${product.rating} out of 5`}
          className="font-medium"
        >
          ★{" "}
          {product.rating.toFixed(
            1,
          )}
        </span>

        <span className="text-sm text-muted-foreground">
          {product.reviews.length}{" "}
          {product.reviews.length ===
          1
            ? "review"
            : "reviews"}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <p className="text-3xl font-semibold">
          {formatInr(
            product.price,
          )}
        </p>

        {originalPrice ? (
          <>
            <p className="pb-1 text-sm text-muted-foreground line-through">
              {formatInr(
                originalPrice,
              )}
            </p>

            <p className="pb-1 text-sm font-medium">
              {product.discountPercentage.toFixed(
                0,
              )}
              % off
            </p>
          </>
        ) : null}
      </div>

      <div className="mt-6 border-t pt-6">
        {product.stock <= 0 ? (
          <p className="font-medium text-destructive">
            Out of stock
          </p>
        ) : (
          <p className="font-medium">
            {
              product.availabilityStatus
            }
          </p>
        )}

        {product.stock > 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {product.stock} units
            available
          </p>
        ) : null}
      </div>

      {variants.length > 0 ? (
        <fieldset className="mt-6">
          <legend className="text-sm font-medium">
            Select variant
          </legend>

          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map(
              (variant) => {
                const selected =
                  selectedVariant?.id ===
                  variant.id;

                const outOfStock =
                  variant.stock <= 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    aria-label={
                      outOfStock
                        ? `${variant.label} - Out of stock`
                        : `${variant.label} - ${variant.stock} in stock`
                    }
                    aria-pressed={
                      selected
                    }
                    data-unavailable={
                      outOfStock
                        ? "true"
                        : undefined
                    }
                    onClick={() =>
                      selectVariant(
                        variant,
                      )
                    }
                    className={`min-w-14 rounded-xl border px-4 py-2 text-sm transition ${
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "hover:border-foreground/50"
                    } ${
                      outOfStock
                        ? "line-through opacity-45"
                        : ""
                    }`}
                  >
                    {variant.label}
                  </button>
                );
              },
            )}
          </div>

          {selectedVariant &&
          selectedVariant.stock <=
            0 ? (
            <p
              className="mt-3 text-sm font-medium text-destructive"
              role="status"
            >
              This selected
              variant is out of
              stock. Choose another
              variant to continue.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="mt-6">
        <p className="text-sm font-medium">
          Quantity
        </p>

        <div className="mt-3 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            aria-label="Decrease quantity"
            disabled={
              unavailable ||
              quantity <= 1
            }
            onClick={() => {
              setQuantity(
                (current) =>
                  Math.max(
                    1,
                    current - 1,
                  ),
              );
              setAdded(false);
            }}
          >
            −
          </Button>

          <output
            aria-label="Quantity"
            className="min-w-10 text-center font-medium"
          >
            {quantity}
          </output>

          <Button
            type="button"
            variant="outline"
            aria-label="Increase quantity"
            disabled={
              unavailable ||
              quantity >=
                availableStock
            }
            onClick={() => {
              setQuantity(
                (current) =>
                  Math.min(
                    current + 1,
                    availableStock,
                  ),
              );
              setAdded(false);
            }}
          >
            +
          </Button>
        </div>

        {!unavailable ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Maximum{" "}
            {availableStock} for
            this selection.
          </p>
        ) : null}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          disabled={unavailable}
          onClick={addToCart}
        >
          {unavailable
            ? selectedVariant
              ? "Variant unavailable"
              : "Out of stock"
            : added
              ? "Added to cart"
              : "Add to Cart"}
        </Button>

        <Button
          type="button"
          size="lg"
          variant="outline"
          disabled={unavailable}
          onClick={buyNow}
        >
          Buy Now
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="mt-3 w-full"
        aria-pressed={
          isWishlisted
        }
        onClick={() =>
          toggleProduct(product.id)
        }
      >
        {isWishlisted
          ? "♥ Remove from wishlist"
          : "♡ Add to wishlist"}
      </Button>
    </section>
  );
}
