"use client";

import { Button } from "@/components/ui/button";
import type {
  ProductCategory,
  ProductFilters,
} from "@/types/product";
import { formatInr } from "@/utils/currency";

type ActiveFilterChipsProps = {
  filters: ProductFilters;
  categories: ProductCategory[];
  onFiltersChange: (
    filters: ProductFilters,
  ) => void;
};

function getCategoryName(
  slug: string,
  categories: ProductCategory[],
) {
  return (
    categories.find(
      (category) =>
        category.slug === slug,
    )?.name ??
    slug
      .split("-")
      .map(
        (part) =>
          part.charAt(0).toUpperCase() +
          part.slice(1),
      )
      .join(" ")
  );
}

export function ActiveFilterChips({
  filters,
  categories,
  onFiltersChange,
}: ActiveFilterChipsProps) {
  const chips: Array<{
    key: string;
    label: string;
    remove: () => void;
  }> = [];

  if (filters.minPrice !== undefined) {
    chips.push({
      key: "min-price",
      label: `Min ${formatInr(filters.minPrice)}`,
      remove: () =>
        onFiltersChange({
          ...filters,
          minPrice: undefined,
        }),
    });
  }

  if (filters.maxPrice !== undefined) {
    chips.push({
      key: "max-price",
      label: `Max ${formatInr(filters.maxPrice)}`,
      remove: () =>
        onFiltersChange({
          ...filters,
          maxPrice: undefined,
        }),
    });
  }

  if (filters.minRating !== undefined) {
    chips.push({
      key: "rating",
      label: `${filters.minRating}★ & up`,
      remove: () =>
        onFiltersChange({
          ...filters,
          minRating: undefined,
        }),
    });
  }

  if (filters.availability) {
    chips.push({
      key: "availability",
      label:
        filters.availability ===
        "in-stock"
          ? "In stock"
          : "Out of stock",
      remove: () =>
        onFiltersChange({
          ...filters,
          availability: undefined,
        }),
    });
  }

  if (filters.onSale) {
    chips.push({
      key: "sale",
      label: "On sale",
      remove: () =>
        onFiltersChange({
          ...filters,
          onSale: undefined,
        }),
    });
  }

  filters.brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: `Brand: ${brand}`,
      remove: () =>
        onFiltersChange({
          ...filters,
          brands: filters.brands.filter(
            (value) => value !== brand,
          ),
        }),
    });
  });

  filters.categories.forEach(
    (category) => {
      chips.push({
        key: `category-${category}`,
        label: getCategoryName(
          category,
          categories,
        ),
        remove: () =>
          onFiltersChange({
            ...filters,
            categories:
              filters.categories.filter(
                (value) =>
                  value !== category,
              ),
          }),
      });
    },
  );

  if (chips.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Active filters"
    >
      <span className="mr-1 text-xs font-medium text-muted-foreground">
        Active filters:
      </span>

      {chips.map((chip) => (
        <Button
          key={chip.key}
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={chip.remove}
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <span aria-hidden="true">
            ×
          </span>
        </Button>
      ))}
    </div>
  );
}
