import type {
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

export function parseProductDiscoveryState(
  searchParams: URLSearchParams,
): ProductDiscoveryState {
  const search =
    searchParams.get("q")?.trim() || undefined;

  const category = search
    ? undefined
    : searchParams.get("category")?.trim() ||
      undefined;

  const sortByValue = searchParams.get("sortBy");
  const orderValue = searchParams.get("order");

  const sortBy = isProductSortField(sortByValue)
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
    page: parsePage(searchParams.get("page")),
  };
}

export function createProductDiscoveryParams(
  state: ProductDiscoveryState,
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

  return params;
}
