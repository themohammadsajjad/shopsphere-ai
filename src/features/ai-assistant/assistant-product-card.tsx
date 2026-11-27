"use client";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";
import { formatInr } from "@/utils/currency";

export function AssistantProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block overflow-hidden rounded-2xl border bg-background transition hover:border-foreground/40"
    >
      <div className="relative aspect-square bg-muted/40">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="160px"
          className="object-contain p-3"
        />
      </div>

      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium">
          {product.title}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold">
            {formatInr(
              product.price,
            )}
          </span>

          <span className="text-muted-foreground">
            ★{" "}
            {product.rating.toFixed(
              1,
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
