"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from "@/features/products/search-history";
import { SearchSuggestions } from "@/features/products/search-suggestions";
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
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] =
    useState<string[]>([]);

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

    if (normalizedSearch) {
      addRecentSearch(normalizedSearch);
    }

    onSearchChange(normalizedSearch);
  }, [debouncedSearch, onSearchChange]);

  function handleFocus() {
    setRecentSearches(getRecentSearches());
    setIsOpen(true);
  }

  function handleSearchChange(
    value: string,
  ) {
    setSearch(value);
    setIsOpen(true);
  }

  function handleSelectSearch(
    value: string,
  ) {
    const normalizedSearch =
      normalizeSearch(value);

    if (!normalizedSearch) {
      return;
    }

    setSearch(normalizedSearch);
    setRecentSearches(
      addRecentSearch(normalizedSearch),
    );
    setIsOpen(false);
  }

  function clearSearch() {
    setSearch("");
    setRecentSearches(getRecentSearches());
    setIsOpen(true);
  }

  function handleClearRecent() {
    clearRecentSearches();
    setRecentSearches([]);
  }

  const normalizedInput =
    normalizeSearch(search);

  const normalizedDebouncedSearch =
    normalizeSearch(debouncedSearch);

  const isDebouncing =
    normalizedInput !==
    normalizedDebouncedSearch;

  return (
    <div className="w-full">
      <label
        htmlFor="product-search"
        className="mb-2 block text-sm font-medium"
      >
        Search products
      </label>

      <div
        className="relative"
        onBlur={(event) => {
          const nextTarget =
            event.relatedTarget as Node | null;

          if (
            !event.currentTarget.contains(
              nextTarget,
            )
          ) {
            setIsOpen(false);
          }
        }}
      >
        <div className="flex gap-2">
          <input
            id="product-search"
            name="product-search"
            type="search"
            autoComplete="off"
            value={search}
            onFocus={handleFocus}
            onChange={(event) =>
              handleSearchChange(
                event.target.value,
              )
            }
            aria-haspopup="dialog"
            aria-controls="product-search-suggestions"
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

        {isOpen &&
        (!normalizedInput ||
          !isDebouncing) ? (
          <div id="product-search-suggestions">
            <SearchSuggestions
              search={
                normalizedDebouncedSearch ?? ""
              }
              recentSearches={
                recentSearches
              }
              onSelectSearch={
                handleSelectSearch
              }
              onClearRecent={
                handleClearRecent
              }
            />
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Results update after you stop typing.
      </p>
    </div>
  );
}
