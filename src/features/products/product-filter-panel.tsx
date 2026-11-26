"use client";

import { Button } from "@/components/ui/button";
import {
  countActiveProductFilters,
  EMPTY_PRODUCT_FILTERS,
} from "@/features/products/product-filters";
import type {
  ProductAvailabilityFilter,
  ProductFilters,
} from "@/types/product";

type ProductFilterPanelProps = {
  filters: ProductFilters;
  brands: string[];
  categories: Array<{
    slug: string;
    name: string;
  }>;
  priceBounds?: {
    min: number;
    max: number;
  };
  onFiltersChange: (filters: ProductFilters) => void;
};

function toggleValue(
  values: string[],
  value: string,
) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function ProductFilterPanel({
  filters,
  brands,
  categories,
  priceBounds = {
    min: 0,
    max: 5000,
  },
  onFiltersChange,
}: ProductFilterPanelProps) {
  const activeFilterCount =
    countActiveProductFilters(filters);

  const minimumPrice = Math.max(
    0,
    Math.floor(priceBounds.min),
  );

  const maximumPrice = Math.max(
    minimumPrice + 1,
    Math.ceil(priceBounds.max),
  );

  const selectedMinPrice =
    filters.minPrice ?? minimumPrice;

  const selectedMaxPrice =
    filters.maxPrice ?? maximumPrice;

  function updateFilters(
    updates: Partial<ProductFilters>,
  ) {
    onFiltersChange({
      ...filters,
      ...updates,
    });
  }

  function updatePrice(
    field: "minPrice" | "maxPrice",
    value: string,
  ) {
    const parsedValue =
      value.trim() === ""
        ? undefined
        : Number(value);

    updateFilters({
      [field]:
        parsedValue !== undefined &&
        Number.isFinite(parsedValue) &&
        parsedValue >= 0
          ? parsedValue
          : undefined,
    });
  }

  function updateAvailability(
    availability?: ProductAvailabilityFilter,
  ) {
    updateFilters({
      availability,
    });
  }

  return (
    <aside className="glass-panel rounded-3xl border p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Filters
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            {activeFilterCount} active
          </p>
        </div>

        {activeFilterCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onFiltersChange({
                ...EMPTY_PRODUCT_FILTERS,
              })
            }
          >
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="mt-5 space-y-6">
        <fieldset>
          <legend className="text-sm font-medium">
            Price range
          </legend>

          <div className="mt-3 space-y-3">
            <input
              type="range"
              min={minimumPrice}
              max={maximumPrice}
              value={Math.min(
                selectedMinPrice,
                selectedMaxPrice,
              )}
              onChange={(event) =>
                updatePrice(
                  "minPrice",
                  event.target.value,
                )
              }
              className="w-full accent-foreground"
              aria-label="Minimum price slider"
            />

            <input
              type="range"
              min={minimumPrice}
              max={maximumPrice}
              value={Math.max(
                selectedMaxPrice,
                selectedMinPrice,
              )}
              onChange={(event) =>
                updatePrice(
                  "maxPrice",
                  event.target.value,
                )
              }
              className="w-full accent-foreground"
              aria-label="Maximum price slider"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-xs text-muted-foreground">
              Minimum (₹)
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={filters.minPrice ?? ""}
                onChange={(event) =>
                  updatePrice(
                    "minPrice",
                    event.target.value,
                  )
                }
                className="mt-1 h-10 w-full rounded-xl border bg-background/70 px-3 text-sm text-foreground outline-none transition focus:border-foreground"
                placeholder="0"
              />
            </label>

            <label className="text-xs text-muted-foreground">
              Maximum (₹)
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={filters.maxPrice ?? ""}
                onChange={(event) =>
                  updatePrice(
                    "maxPrice",
                    event.target.value,
                  )
                }
                className="mt-1 h-10 w-full rounded-xl border bg-background/70 px-3 text-sm text-foreground outline-none transition focus:border-foreground"
                placeholder="Any"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">
            Minimum rating
          </legend>

          <select
            value={filters.minRating ?? ""}
            onChange={(event) =>
              updateFilters({
                minRating: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            className="mt-3 h-10 w-full rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
            aria-label="Minimum rating"
          >
            <option value="">
              Any rating
            </option>
            <option value="4">
              4★ & up
            </option>
            <option value="3">
              3★ & up
            </option>
            <option value="2">
              2★ & up
            </option>
          </select>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">
            Availability
          </legend>

          <div className="mt-3 space-y-2">
            {[
              ["", "Any availability"],
              ["in-stock", "In stock"],
              ["out-of-stock", "Out of stock"],
            ].map(([value, label]) => (
              <label
                key={label}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="availability"
                  checked={
                    (filters.availability ?? "") ===
                    value
                  }
                  onChange={() =>
                    updateAvailability(
                      value
                        ? (value as ProductAvailabilityFilter)
                        : undefined,
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.onSale ?? false}
            onChange={(event) =>
              updateFilters({
                onSale: event.target.checked
                  ? true
                  : undefined,
              })
            }
          />
          On sale only
        </label>

        {brands.length > 0 ? (
          <fieldset>
            <legend className="text-sm font-medium">
              Brands
            </legend>

            <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(
                      brand,
                    )}
                    onChange={() =>
                      updateFilters({
                        brands: toggleValue(
                          filters.brands,
                          brand,
                        ),
                      })
                    }
                  />
                  {brand}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {categories.length > 0 ? (
          <fieldset>
            <legend className="text-sm font-medium">
              Categories
            </legend>

            <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
              {categories.map((category) => (
                <label
                  key={category.slug}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(
                      category.slug,
                    )}
                    onChange={() =>
                      updateFilters({
                        categories: toggleValue(
                          filters.categories,
                          category.slug,
                        ),
                      })
                    }
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>
    </aside>
  );
}
