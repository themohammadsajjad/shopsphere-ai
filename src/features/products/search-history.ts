const RECENT_SEARCHES_KEY =
  "shopsphere_recent_searches";

const RECENT_SEARCH_LIMIT = 5;

function normalizeSearch(value: string) {
  return value.trim();
}

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(
      RECENT_SEARCHES_KEY,
    );

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (value): value is string =>
        typeof value === "string" &&
        normalizeSearch(value).length > 0,
    );
  } catch {
    return [];
  }
}

export function addRecentSearch(
  search: string,
): string[] {
  const normalizedSearch =
    normalizeSearch(search);

  if (!normalizedSearch) {
    return getRecentSearches();
  }

  const existingSearches =
    getRecentSearches();

  const nextSearches = [
    normalizedSearch,
    ...existingSearches.filter(
      (value) =>
        value.toLowerCase() !==
        normalizedSearch.toLowerCase(),
    ),
  ].slice(0, RECENT_SEARCH_LIMIT);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(nextSearches),
      );
    } catch {
      return existingSearches;
    }
  }

  return nextSearches;
}

export function clearRecentSearches() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      RECENT_SEARCHES_KEY,
    );
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}
