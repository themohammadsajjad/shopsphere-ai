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

import { ProductDiscovery } from "./product-discovery";

const push = vi.fn();
const replace = vi.fn();

let currentSearchParams =
  new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace,
  }),
  usePathname: () => "/products",
  useSearchParams: () =>
    currentSearchParams,
}));

vi.mock("@/features/products/product-search", () => ({
  ProductSearch: ({
    initialValue,
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
          onSearchChange("laptop")
        }
      >
        Test search
      </button>
    </div>
  ),
}));

vi.mock("@/features/products/category-filter", () => ({
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
        {selectedCategory ?? "all"}
      </span>

      <button
        type="button"
        onClick={() =>
          onCategoryChange("beauty")
        }
      >
        Test category
      </button>
    </div>
  ),
}));

vi.mock("@/features/products/product-sort", () => ({
  ProductSort: ({
    sortBy,
    order,
    onSortChange,
  }: {
    sortBy?: string;
    order?: string;
    onSortChange: (
      sortBy?: "price",
      order?: "desc",
    ) => void;
  }) => (
    <div>
      <span data-testid="sort-value">
        {sortBy ?? "default"}-
        {order ?? "none"}
      </span>

      <button
        type="button"
        onClick={() =>
          onSortChange("price", "desc")
        }
      >
        Test sort
      </button>
    </div>
  ),
}));

vi.mock("@/features/products/product-results", () => ({
  ProductResults: ({
    params,
    onPageChange,
  }: {
    params: {
      limit?: number;
      skip?: number;
      search?: string;
      category?: string;
      sortBy?: string;
      order?: string;
    };
    onPageChange: (page: number) => void;
  }) => (
    <div>
      <span data-testid="result-params">
        {JSON.stringify(params)}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(3)}
      >
        Test page
      </button>
    </div>
  ),
}));

describe("ProductDiscovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentSearchParams =
      new URLSearchParams();
  });

  it("maps URL state to the discovery controls and product query", () => {
    currentSearchParams =
      new URLSearchParams(
        "q=phone&sortBy=price&order=desc&page=2",
      );

    render(<ProductDiscovery />);

    expect(
      screen.getByTestId("search-value"),
    ).toHaveTextContent("phone");

    expect(
      screen.getByTestId("category-value"),
    ).toHaveTextContent("all");

    expect(
      screen.getByTestId("sort-value"),
    ).toHaveTextContent(
      "price-desc",
    );

    expect(
      screen.getByTestId("result-params"),
    ).toHaveTextContent(
      '"limit":12',
    );

    expect(
      screen.getByTestId("result-params"),
    ).toHaveTextContent(
      '"skip":12',
    );

    expect(
      screen.getByTestId("result-params"),
    ).toHaveTextContent(
      '"search":"phone"',
    );
  });

  it("replaces the URL when search changes", () => {
    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Test search",
      }),
    );

    expect(replace).toHaveBeenCalledWith(
      "/products?q=laptop",
      {
        scroll: false,
      },
    );

    expect(push).not.toHaveBeenCalled();
  });

  it("pushes a category change and resets the page", () => {
    currentSearchParams =
      new URLSearchParams(
        "page=3",
      );

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Test category",
      }),
    );

    expect(push).toHaveBeenCalledWith(
      "/products?category=beauty",
      {
        scroll: false,
      },
    );
  });

  it("preserves the category when sorting and resets the page", () => {
    currentSearchParams =
      new URLSearchParams(
        "category=beauty&page=3",
      );

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Test sort",
      }),
    );

    expect(push).toHaveBeenCalledWith(
      "/products?category=beauty&sortBy=price&order=desc",
      {
        scroll: false,
      },
    );
  });

  it("preserves discovery state when changing pages", () => {
    currentSearchParams =
      new URLSearchParams(
        "category=beauty&sortBy=price&order=asc&page=2",
      );

    render(<ProductDiscovery />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Test page",
      }),
    );

    expect(push).toHaveBeenCalledWith(
      "/products?category=beauty&sortBy=price&order=asc&page=3",
      {
        scroll: false,
      },
    );
  });
});
