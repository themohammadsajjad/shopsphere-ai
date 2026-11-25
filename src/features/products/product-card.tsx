import Image from "next/image";

import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatCategory(category: string) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="glass-panel group overflow-hidden rounded-3xl border">
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {product.discountPercentage > 0 ? (
          <span className="absolute left-4 top-4 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
            {product.discountPercentage.toFixed(0)}% off
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {formatCategory(product.category)}
          </p>

          <h2 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight">
            {product.title}
          </h2>

          {product.brand ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {product.brand}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xl font-semibold">
            {formatPrice(product.price)}
          </p>

          <p
            className="text-sm text-muted-foreground"
            aria-label={`Rated ${product.rating} out of 5`}
          >
            ★ {product.rating.toFixed(1)}
          </p>
        </div>

        <div className="border-t pt-4">
          {isOutOfStock ? (
            <p className="text-sm font-medium text-destructive">
              Out of stock
            </p>
          ) : isLowStock ? (
            <p className="text-sm font-medium">
              Only {product.stock} left
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {product.availabilityStatus}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
