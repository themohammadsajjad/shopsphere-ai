import type {
  Product,
  ProductVariant,
} from "@/types/product";

function createVariants(
  labels: string[],
  stock: number,
): ProductVariant[] {
  return labels.map(
    (label, index) => ({
      id: `variant-${label
        .toLowerCase()
        .replaceAll(" ", "-")}`,
      label,

      // Keep one local mock variant unavailable
      // so the PDP can exercise MOD-04-001.
      stock:
        stock <= 0
          ? 0
          : index === 1
            ? 0
            : Math.min(
                stock,
                3 + index,
              ),
    }),
  );
}

export function getProductVariants(
  product: Product,
): ProductVariant[] {
  const category =
    product.category.toLowerCase();

  if (category.includes("shoes")) {
    return createVariants(
      ["7", "8", "9", "10"],
      product.stock,
    );
  }

  if (
    category.includes("shirts") ||
    category.includes("tops") ||
    category.includes("dresses")
  ) {
    return createVariants(
      ["S", "M", "L", "XL"],
      product.stock,
    );
  }

  return [];
}
