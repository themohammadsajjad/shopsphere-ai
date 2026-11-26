"use client";

import type {
  ProductSortField,
  SortOrder,
} from "@/types/product";

type ProductSortProps = {
  sortBy?: ProductSortField;
  order?: SortOrder;
  onSortChange: (
    sortBy?: ProductSortField,
    order?: SortOrder,
  ) => void;
};

type SortValue =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "newest"
  | "discount-desc"
  | "title-asc";

function getSortValue(
  sortBy?: ProductSortField,
  order?: SortOrder,
): SortValue {
  if (!sortBy) {
    return "default";
  }

  if (
    sortBy === "price" &&
    order === "asc"
  ) {
    return "price-asc";
  }

  if (
    sortBy === "price" &&
    order === "desc"
  ) {
    return "price-desc";
  }

  if (
    sortBy === "rating" &&
    order === "desc"
  ) {
    return "rating-desc";
  }

  if (
    sortBy === "createdAt" &&
    order === "desc"
  ) {
    return "newest";
  }

  if (
    sortBy === "discountPercentage" &&
    order === "desc"
  ) {
    return "discount-desc";
  }

  if (
    sortBy === "title" &&
    order === "asc"
  ) {
    return "title-asc";
  }

  return "default";
}

export function ProductSort({
  sortBy,
  order,
  onSortChange,
}: ProductSortProps) {
  const value = getSortValue(
    sortBy,
    order,
  );

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextValue =
      event.target.value as SortValue;

    switch (nextValue) {
      case "price-asc":
        onSortChange("price", "asc");
        break;

      case "price-desc":
        onSortChange("price", "desc");
        break;

      case "rating-desc":
        onSortChange("rating", "desc");
        break;

      case "newest":
        onSortChange("createdAt", "desc");
        break;

      case "discount-desc":
        onSortChange(
          "discountPercentage",
          "desc",
        );
        break;

      case "title-asc":
        onSortChange("title", "asc");
        break;

      default:
        onSortChange(
          undefined,
          undefined,
        );
    }
  }

  return (
    <div className="w-full sm:w-auto">
      <label
        htmlFor="product-sort"
        className="mb-2 block text-sm font-medium"
      >
        Sort products
      </label>

      <select
        id="product-sort"
        name="product-sort"
        value={value}
        onChange={handleChange}
        className="h-10 w-full rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground sm:w-52"
      >
        <option value="default">
          Relevance
        </option>

        <option value="price-asc">
          Price: Low to high
        </option>

        <option value="price-desc">
          Price: High to low
        </option>

        <option value="rating-desc">
          Rating: High to low
        </option>

        <option value="newest">
          Newest
        </option>

        <option value="discount-desc">
          Biggest discount
        </option>

        <option value="title-asc">
          Name: A to Z
        </option>
      </select>
    </div>
  );
}
