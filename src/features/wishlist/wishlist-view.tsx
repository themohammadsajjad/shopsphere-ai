"use client";

import {
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import {
  ProductServiceError,
  getProductById,
} from "@/services/product-service";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatInr } from "@/utils/currency";

export function WishlistView() {
  const productIds =
    useWishlistStore(
      (state) =>
        state.productIds,
    );

  const toggleProduct =
    useWishlistStore(
      (state) =>
        state.toggleProduct,
    );

  const addItem =
    useCartStore(
      (state) =>
        state.addItem,
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

  const queries =
    useQueries({
      queries:
        productIds.map(
          (productId) => ({
            queryKey: [
              "wishlist-product",
              productId,
            ],
            queryFn: () =>
              getProductById(
                productId,
              ),
            retry: false,
          }),
        ),
    });

  if (!hasHydrated) {
    return (
      <div
        role="status"
        className="h-72 animate-pulse rounded-3xl border bg-muted/40"
      />
    );
  }

  if (
    productIds.length === 0
  ) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h2 className="text-2xl font-semibold">
          Your wishlist is empty
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Save products here so
          you can find them again
          later.
        </p>

        <Link
          href="/products"
          className={buttonVariants({
            className:
              "mt-5",
          })}
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productIds.map(
          (
            productId,
            index,
          ) => {
            const query =
              queries[index];

            const unavailable =
              query?.error instanceof
                ProductServiceError &&
              query.error.status ===
                404;

            const product =
              query?.data;

            if (
              query?.isPending
            ) {
              return (
                <div
                  key={
                    productId
                  }
                  className="aspect-[0.85] animate-pulse rounded-3xl border bg-muted/40"
                />
              );
            }

            if (
              unavailable ||
              !product
            ) {
              return (
                <article
                  key={
                    productId
                  }
                  className="glass-panel rounded-3xl border p-5"
                >
                  <h3 className="font-semibold">
                    Product{" "}
                    {productId}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-destructive">
                    No longer
                    available
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    disabled
                  >
                    Move to Cart
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      toggleProduct(
                        productId,
                      )
                    }
                  >
                    Remove
                  </Button>
                </article>
              );
            }

            const outOfStock =
              product.stock <=
              0;

            return (
              <article
                key={product.id}
                className="glass-panel overflow-hidden rounded-3xl border"
              >
                <div className="relative aspect-square bg-muted/30">
                  <Image
                    src={
                      product.thumbnail
                    }
                    alt={
                      product.title
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-contain p-5"
                  />
                </div>

                <div className="p-5">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-semibold hover:underline"
                  >
                    {
                      product.title
                    }
                  </Link>

                  <p className="mt-2 font-medium">
                    {formatInr(
                      product.price,
                    )}
                  </p>

                  <p
                    className={`mt-2 text-sm ${
                      outOfStock
                        ? "font-medium text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {outOfStock
                      ? "Out of stock"
                      : `${product.stock} in stock`}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5 w-full"
                    disabled={
                      outOfStock
                    }
                    onClick={() => {
                      addItem({
                        productId:
                          product.id,
                        title:
                          product.title,
                        price:
                          product.price,
                        thumbnail:
                          product.thumbnail,
                        quantity:
                          1,
                        stock:
                          product.stock,
                      });

                      toggleProduct(
                        product.id,
                      );
                    }}
                  >
                    Move to Cart
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-2 w-full"
                    onClick={() =>
                      toggleProduct(
                        product.id,
                      )
                    }
                  >
                    Remove from
                    wishlist
                  </Button>
                </div>
              </article>
            );
          },
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          Because of your Wishlist
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Wishlist-derived
          recommendations will
          appear here when the
          recommendation engine is
          connected.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="glass-panel aspect-[0.9] animate-pulse rounded-2xl border bg-muted/30"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
