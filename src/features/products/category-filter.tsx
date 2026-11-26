"use client";

import { Button } from "@/components/ui/button";
import { useProductCategoriesQuery } from "@/features/products/queries";

type CategoryFilterProps = {
  selectedCategory?: string;
  onCategoryChange: (category?: string) => void;
};

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categoriesQuery = useProductCategoriesQuery();

  if (categoriesQuery.isPending) {
    return (
      <div
        className="flex gap-2 overflow-hidden"
        aria-label="Loading product categories"
        role="status"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-24 shrink-0 animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Categories could not be loaded.
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => categoriesQuery.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const categories = categoriesQuery.data ?? [];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      aria-label="Product categories"
    >
      <Button
        type="button"
        size="sm"
        variant={!selectedCategory ? "default" : "outline"}
        onClick={() => onCategoryChange(undefined)}
        aria-pressed={!selectedCategory}
        className="shrink-0"
      >
        All
      </Button>

      {categories.map((category) => {
        const isSelected = selectedCategory === category.slug;

        return (
          <Button
            key={category.slug}
            type="button"
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category.slug)}
            aria-pressed={isSelected}
            className="shrink-0"
          >
            {category.name}
          </Button>
        );
      })}
    </div>
  );
}
