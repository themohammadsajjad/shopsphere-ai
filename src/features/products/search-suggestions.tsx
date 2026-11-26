"use client";

import { Button } from "@/components/ui/button";
import { POPULAR_SEARCHES } from "@/features/products/popular-searches";
import {
  useProductCategoriesQuery,
  useProductSuggestionsQuery,
} from "@/features/products/queries";

type SearchSuggestionsProps = {
  search: string;
  recentSearches: string[];
  onSelectSearch: (search: string) => void;
  onClearRecent: () => void;
};

export function SearchSuggestions({
  search,
  recentSearches,
  onSelectSearch,
  onClearRecent,
}: SearchSuggestionsProps) {
  const normalizedSearch = search.trim();

  const suggestionsQuery =
    useProductSuggestionsQuery(normalizedSearch);

  const categoriesQuery =
    useProductCategoriesQuery(
      normalizedSearch.length > 0,
    );

  if (!normalizedSearch) {
    return (
      <div
        className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border bg-background p-4 shadow-lg"
        role="dialog"
        aria-label="Search suggestions"
      >
        {recentSearches.length > 0 ? (
          <section>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold">
                Recent searches
              </h3>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearRecent}
              >
                Clear history
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {recentSearches.map((recentSearch) => (
                <Button
                  key={recentSearch}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onSelectSearch(recentSearch)
                  }
                >
                  {recentSearch}
                </Button>
              ))}
            </div>
          </section>
        ) : null}

        <section
          className={
            recentSearches.length > 0
              ? "mt-4 border-t pt-4"
              : ""
          }
        >
          <h3 className="text-sm font-semibold">
            Popular searches
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((popularSearch) => (
              <Button
                key={popularSearch}
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onSelectSearch(popularSearch)
                }
              >
                {popularSearch}
              </Button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const products =
    suggestionsQuery.data?.products ?? [];

  const matchingCategories =
    (categoriesQuery.data ?? [])
      .filter((category) => {
        const query =
          normalizedSearch.toLowerCase();

        return (
          category.name
            .toLowerCase()
            .includes(query) ||
          category.slug
            .toLowerCase()
            .includes(query)
        );
      })
      .slice(0, 4);

  const isLoading =
    suggestionsQuery.isPending ||
    categoriesQuery.isPending;

  const hasSuggestions =
    products.length > 0 ||
    matchingCategories.length > 0;

  return (
    <div
      className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border bg-background p-4 shadow-lg"
      role="dialog"
      aria-label="Search suggestions"
    >
      {isLoading ? (
        <p
          className="text-sm text-muted-foreground"
          role="status"
        >
          Finding suggestions...
        </p>
      ) : null}

      {!isLoading && !hasSuggestions ? (
        <p className="text-sm text-muted-foreground">
          No suggestions found.
        </p>
      ) : null}

      {products.length > 0 ? (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Products
          </h3>

          <div className="mt-2 space-y-1">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() =>
                  onSelectSearch(product.title)
                }
              >
                {product.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {matchingCategories.length > 0 ? (
        <section
          className={
            products.length > 0
              ? "mt-4 border-t pt-4"
              : ""
          }
        >
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Categories
          </h3>

          <div className="mt-2 space-y-1">
            {matchingCategories.map((category) => (
              <button
                key={category.slug}
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() =>
                  onSelectSearch(category.name)
                }
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
