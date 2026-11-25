"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type ProductSearchProps = {
  initialValue?: string;
  onSearchChange: (search?: string) => void;
};

function normalizeSearch(value: string) {
  return value.trim() || undefined;
}

export function ProductSearch({
  initialValue = "",
  onSearchChange,
}: ProductSearchProps) {
  const [search, setSearch] = useState(initialValue);

  const lastEmittedSearch = useRef<
    string | undefined
  >(normalizeSearch(initialValue));

  const debouncedSearch = useDebouncedValue(
    search,
    350,
  );

  useEffect(() => {
    const normalizedSearch =
      normalizeSearch(debouncedSearch);

    if (
      normalizedSearch ===
      lastEmittedSearch.current
    ) {
      return;
    }

    lastEmittedSearch.current =
      normalizedSearch;

    onSearchChange(normalizedSearch);
  }, [debouncedSearch, onSearchChange]);

  function clearSearch() {
    setSearch("");
  }

  return (
    <div className="w-full">
      <label
        htmlFor="product-search"
        className="mb-2 block text-sm font-medium"
      >
        Search products
      </label>

      <div className="flex gap-2">
        <input
          id="product-search"
          name="product-search"
          type="search"
          autoComplete="off"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="h-10 min-w-0 flex-1 rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
          placeholder="Search phones, laptops, beauty..."
        />

        {search ? (
          <Button
            type="button"
            variant="outline"
            onClick={clearSearch}
            aria-label="Clear product search"
          >
            Clear
          </Button>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Results update after you stop typing.
      </p>
    </div>
  );
}
