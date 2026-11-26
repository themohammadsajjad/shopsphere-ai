import { normalizeProductFilters } from "@/features/products/product-filters";
import type {
  ProductAvailabilityFilter,
  ProductFilters,
  ProductSortField,
  SortOrder,
} from "@/types/product";

export type ProductDiscoveryState = {
  search?: string;
  category?: string;
  sortBy?: ProductSortField;
  order?: SortOrder;
  page: number;
};

const PRODUCT_SORT_FIELDS: ProductSortField[] = [
  "title",
  "price",
  "rating",
  "discountPercentage",
  "createdAt",
];

function isProductSortField(
  value: string | null,
): value is ProductSortField {
  return PRODUCT_SORT_FIELDS.includes(
    value as ProductSortField,
  );
}

function isSortOrder(
  value: string | null,
): value is SortOrder {
  return value === "asc" || value === "desc";
}

function parsePage(value: string | null) {
  if (!value) {
    return 1;
  }

  const page = Number(value);

  return Number.isInteger(page) && page > 0
    ? page
    : 1;
}

function parseNonNegativeNumber(
  value: string | null,
) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) &&
    parsedValue >= 0
    ? parsedValue
    : undefined;
}

function parseRating(value: string | null) {
  const rating = parseNonNegativeNumber(value);

  return rating !== undefined &&
    rating <= 5
    ? rating
    : undefined;
}

function getUniqueValues(
  values: string[],
) {
  return [
    ...new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

export function parseProductDiscoveryState(
  searchParams: URLSearchParams,
): ProductDiscoveryState {
  const search =
    searchParams.get("q")?.trim() || undefined;

  const category = search
    ? undefined
    : searchParams.get("category")?.trim() ||
      undefined;

  const sortByValue =
    searchParams.get("sortBy");

  const orderValue =
    searchParams.get("order");

  const sortBy = isProductSortField(
    sortByValue,
  )
    ? sortByValue
    : undefined;

  const order =
    sortBy && isSortOrder(orderValue)
      ? orderValue
      : sortBy
        ? "asc"
        : undefined;

  return {
    search,
    category,
    sortBy,
    order,
    page: parsePage(
      searchParams.get("page"),
    ),
  };
}

export function parseProductFilters(
  searchParams: URLSearchParams,
): ProductFilters {
  const availabilityValue =
    searchParams.get("availability");

  const availability:
    | ProductAvailabilityFilter
    | undefined =
    availabilityValue === "in-stock" ||
    availabilityValue === "out-of-stock"
      ? availabilityValue
      : undefined;

  return normalizeProductFilters({
    minPrice: parseNonNegativeNumber(
      searchParams.get("minPrice"),
    ),
    maxPrice: parseNonNegativeNumber(
      searchParams.get("maxPrice"),
    ),
    minRating: parseRating(
      searchParams.get("minRating"),
    ),
    availability,
    onSale:
      searchParams.get("sale") === "1"
        ? true
        : undefined,
    brands: getUniqueValues(
      searchParams.getAll("brand"),
    ),
    categories: getUniqueValues(
      searchParams.getAll(
        "filterCategory",
      ),
    ),
  });
}

export function createProductDiscoveryParams(
  state: ProductDiscoveryState,
  filters?: ProductFilters,
) {
  const params = new URLSearchParams();

  if (state.search?.trim()) {
    params.set("q", state.search.trim());
  } else if (state.category?.trim()) {
    params.set(
      "category",
      state.category.trim(),
    );
  }

  if (state.sortBy) {
    params.set("sortBy", state.sortBy);
    params.set(
      "order",
      state.order ?? "asc",
    );
  }

  if (state.page > 1) {
    params.set("page", String(state.page));
  }

  if (filters) {
    const normalized =
      normalizeProductFilters(filters);

    if (normalized.minPrice !== undefined) {
      params.set(
        "minPrice",
        String(normalized.minPrice),
      );
    }

    if (normalized.maxPrice !== undefined) {
      params.set(
        "maxPrice",
        String(normalized.maxPrice),
      );
    }

    if (
      normalized.minRating !== undefined
    ) {
      params.set(
        "minRating",
        String(normalized.minRating),
      );
    }

    if (normalized.availability) {
      params.set(
        "availability",
        normalized.availability,
      );
    }

    if (normalized.onSale) {
      params.set("sale", "1");
    }

    normalized.brands.forEach((brand) => {
      params.append("brand", brand);
    });

    normalized.categories.forEach(
      (category) => {
        params.append(
          "filterCategory",
          category,
        );
      },
    );
  }

  return params;
}
