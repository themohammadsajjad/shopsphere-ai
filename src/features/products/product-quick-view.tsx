"use client";

import {
  useEffect,
} from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { formatInr } from "@/utils/currency";

type ProductQuickViewProps = {
  product: Product | null;
  onClose: () => void;
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

export function ProductQuickView({
  product,
  onClose,
}: ProductQuickViewProps) {
  useEffect(() => {
    if (!product) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border bg-background p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {formatCategory(
                product.category,
              )}
            </p>

            <h2
              id="quick-view-title"
              className="mt-2 text-2xl font-semibold"
            >
              {product.title}
            </h2>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            aria-label="Close quick view"
          >
            ✕
          </Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/40">
            <Image
              src={
                product.images[0] ??
                product.thumbnail
              }
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-5"
            />
          </div>

          <div className="space-y-5">
            {product.brand ? (
              <p className="text-sm text-muted-foreground">
                {product.brand}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-2xl font-semibold">
                {formatInr(
                  product.price,
                )}
              </p>

              <p className="text-sm text-muted-foreground">
                ★{" "}
                {product.rating.toFixed(
                  1,
                )}
              </p>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border p-3">
                <dt className="text-muted-foreground">
                  Stock
                </dt>
                <dd className="mt-1 font-medium">
                  {product.stock}
                </dd>
              </div>

              <div className="rounded-xl border p-3">
                <dt className="text-muted-foreground">
                  Discount
                </dt>
                <dd className="mt-1 font-medium">
                  {product.discountPercentage.toFixed(
                    0,
                  )}
                  %
                </dd>
              </div>

              <div className="rounded-xl border p-3">
                <dt className="text-muted-foreground">
                  Shipping
                </dt>
                <dd className="mt-1 font-medium">
                  {
                    product.shippingInformation
                  }
                </dd>
              </div>

              <div className="rounded-xl border p-3">
                <dt className="text-muted-foreground">
                  Returns
                </dt>
                <dd className="mt-1 font-medium">
                  {
                    product.returnPolicy
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
