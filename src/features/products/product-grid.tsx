import { ProductCard } from "@/features/products/product-card";
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
  return (
    <section
      aria-label="Product results"
      className={
        isPlaceholderData
          ? "opacity-60 transition-opacity"
          : "transition-opacity"
      }
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {total} products found
        </p>

        {isUpdating ? (
          <p
            className="text-xs text-muted-foreground"
            role="status"
          >
            Updating results...
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
