import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  ProductFilters,
  ProductListParams,
  ProductSortField,
  SortOrder,
} from "@/types/product";

import { ProductDiscovery } from "./product-discovery";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  query: {
    value: "",
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: navigation.push,
    replace: navigation.replace,
  }),
  usePathname: () => "/products",
  useSearchParams: () =>
    new URLSearchParams(
      navigation.query.value,
    ),
}));

vi.mock(
  "@/features/products/product-search",
  () => ({
    ProductSearch: ({
      initialValue = "",
      onSearchChange,
    }: {
      initialValue?: string;
      onSearchChange: (
        search?: string,
      ) => void;
    }) => (
      <div>
        <span data-testid="search-value">
          {initialValue}
        </span>

        <button
          type="button"
          onClick={() =>
            onSearchChange("phone")
          }
        >
          Change search
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "@/features/products/category-filter",
  () => ({
    CategoryFilter: ({
      selectedCategory,
      onCategoryChange,
    }: {
      selectedCategory?: string;
      onCategoryChange: (
        category?: string,
      ) => void;
    }) => (
      <div>
        <span data-testid="category-value">
          {selectedCategory ?? ""}
        </span>

        <button
          type="button"
          onClick={() =>
            onCategoryChange("laptops")
          }
        >
          Choose laptops
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "@/features/products/product-sort",
  () => ({
    ProductSort: ({
      sortBy,
      order,
      onSortChange,
    }: {
      sortBy?: ProductSortField;
      order?: SortOrder;
      onSortChange: (
        sortBy?: ProductSortField,
        order?: SortOrder,
      ) => void;
    }) => (
      <div>
        <span data-testid="sort-value">
          {sortBy
            ? `${sortBy}:${order}`
            : "default"}
        </span>

        <button
          type="button"
          onClick={() =>
            onSortChange(
              "price",
              "asc",
            )
          }
        >
          Sort price
        </button>
      </div>
    ),
  }),
);

type MockResultsProps = {
  params?: ProductListParams;
  filters: ProductFilters;
  page: number;
  limit?: number;
  onFiltersChange: (
    filters: ProductFilters,
  ) => void;
  onPageChange: (page: number) => void;
};

vi.mock(
  "@/features/products/filtered-product-results",
  () => ({
    FilteredProductResults: ({
      params = {},
      filters,
      page,
      limit,
      onFiltersChange,
      onPageChange,
    }: MockResultsProps) => (
      <div>
        <pre data-testid="results-props">
          {JSON.stringify({
            params,
            filters,
            page,
            limit,
          })}
        </pre>

        <button
          type="button"
          onClick={() =>
            onFiltersChange({
              minPrice: 100,
              brands: [],
              categories: [],
            })
          }
        >
          Apply filter
        </button>

        <button
          type="button"
          onClick={() =>
            onPageChange(2)
          }
        >
          Go to page 2
        </button>
      </div>
    ),
  }),
);

function getResultsProps() {
  return JSON.parse(
    screen.getByTestId(
      "results-props",
    ).textContent ?? "{}",
  );
}

describe("ProductDiscovery", () => {
  beforeEach(() => {
    navigation.query.value = "";
    navigation.push.mockClear();
    navigation.replace.mockClear();
  });

  it("maps URL state and filters to the discovery controls", () => {
    navigation.query.value =
      "q=laptop&sortBy=price&order=desc&page=2&minPrice=100&maxPrice=2000&minRating=4&availability=in-stock&sale=1&brand=Apple&brand=Asus&filterCategory=laptops";

    render(<ProductDiscovery />);

    expect(
      screen.getByTestId("search-value"),
    ).toHaveTextContent("laptop");

    expect(
      screen.getByTestId(
        "category-value",
      ),
    ).toHaveTextContent("");

    expect(
      screen.getByTestId("sort-value"),
    ).toHaveTextContent(
      "price:desc",
    );

    expect(getResultsProps()).toEqual({
      params: {
        search: "laptop",
        sortBy: "price",
        order: "desc",
      },
      filters: {
        minPrice: 100,
        maxPrice: 2000,
        minRating: 4,
        availability: "in-stock",
        onSale: true,
        brands: ["Apple", "Asus"],
        categories: ["laptops"],
      },
      page: 2,
      limit: 12,
    });
  });

  it("replaces the URL when search changes and preserves filters", () => {
    navigation.query.value =
      "category=beauty&page=3&minRating=4";

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Change search",
      }),
    );

    expect(
      navigation.replace,
    ).toHaveBeenCalledWith(
      "/products?q=phone&minRating=4",
      {
        scroll: false,
      },
    );
  });

  it("pushes a category change and resets the page", () => {
    navigation.query.value =
      "category=beauty&page=3&minPrice=10";

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Choose laptops",
      }),
    );

    expect(
      navigation.push,
    ).toHaveBeenCalledWith(
      "/products?category=laptops&minPrice=10",
      {
        scroll: false,
      },
    );
  });

  it("preserves discovery state when sorting and resets the page", () => {
    navigation.query.value =
      "category=beauty&page=3&maxPrice=500";

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort price",
      }),
    );

    expect(
      navigation.push,
    ).toHaveBeenCalledWith(
      "/products?category=beauty&sortBy=price&order=asc&maxPrice=500",
      {
        scroll: false,
      },
    );
  });

  it("pushes filter changes and resets the page", () => {
    navigation.query.value =
      "category=beauty&sortBy=rating&order=desc&page=4";

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Apply filter",
      }),
    );

    expect(
      navigation.push,
    ).toHaveBeenCalledWith(
      "/products?category=beauty&sortBy=rating&order=desc&minPrice=100",
      {
        scroll: false,
      },
    );
  });

  it("preserves discovery state and filters when changing pages", () => {
    navigation.query.value =
      "category=beauty&sortBy=rating&order=desc&minPrice=100&brand=Acme";

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Go to page 2",
      }),
    );

    expect(
      navigation.push,
    ).toHaveBeenCalledWith(
      "/products?category=beauty&sortBy=rating&order=desc&page=2&minPrice=100&brand=Acme",
      {
        scroll: false,
      },
    );
  });
});
