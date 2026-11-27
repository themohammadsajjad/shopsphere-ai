import type {
  Product,
} from "@/types/product";

export function mergeAdminProducts(
  baseProducts:
    Product[],
  upsertedProducts:
    Product[],
  deletedIds:
    number[],
) {
  const deleted =
    new Set(
      deletedIds,
    );

  const map =
    new Map<
      number,
      Product
    >();

  for (const product of baseProducts) {
    if (
      !deleted.has(
        product.id,
      )
    ) {
      map.set(
        product.id,
        product,
      );
    }
  }

  for (const product of upsertedProducts) {
    if (
      !deleted.has(
        product.id,
      )
    ) {
      map.set(
        product.id,
        product,
      );
    }
  }

  return [
    ...map.values(),
  ];
}

export function createLocalProduct(
  input: {
    title: string;
    category: string;
    price: number;
    stock: number;
  },
): Product {
  const now =
    new Date().toISOString();

  const id =
    Date.now();

  return {
    id,
    title:
      input.title.trim(),
    description:
      "Locally simulated admin product.",
    category:
      input.category
        .trim()
        .toLowerCase()
        .replaceAll(
          " ",
          "-",
        ),
    price:
      input.price,
    discountPercentage: 0,
    rating: 0,
    stock:
      input.stock,
    tags: [],
    brand:
      "Local Simulation",
    sku:
      `LOCAL-${id}`,
    weight: 1,
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation:
      "Local simulation",
    shippingInformation:
      "Local simulation",
    availabilityStatus:
      input.stock > 0
        ? "In Stock"
        : "Out of Stock",
    reviews: [],
    returnPolicy:
      "Local simulation",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: now,
      updatedAt: now,
      barcode:
        String(id),
      qrCode:
        "local-simulation",
    },
    images: [
      "/file.svg",
    ],
    thumbnail:
      "/file.svg",
  };
}
