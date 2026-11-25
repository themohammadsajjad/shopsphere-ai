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

import {
  useProductCategoriesQuery,
  useProductSuggestionsQuery,
} from "@/features/products/queries";
import type {
  Product,
  ProductCategory,
} from "@/types/product";

import { SearchSuggestions } from "./search-suggestions";

vi.mock("@/features/products/queries", () => ({
  useProductSuggestionsQuery: vi.fn(),
  useProductCategoriesQuery: vi.fn(),
}));

const mockedSuggestionsQuery = vi.mocked(
  useProductSuggestionsQuery,
);

const mockedCategoriesQuery = vi.mocked(
  useProductCategoriesQuery,
);

describe("SearchSuggestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedSuggestionsQuery.mockReturnValue({
      isPending: false,
      data: {
        products: [],
        total: 0,
        skip: 0,
        limit: 5,
      },
    } as unknown as ReturnType<
      typeof useProductSuggestionsQuery
    >);

    mockedCategoriesQuery.mockReturnValue({
      isPending: false,
      data: [],
    } as unknown as ReturnType<
      typeof useProductCategoriesQuery
    >);
  });

  it("shows recent and popular searches for an empty input", () => {
    const onSelectSearch = vi.fn();

    render(
      <SearchSuggestions
        search=""
        recentSearches={[
          "camera",
          "phone",
        ]}
        onSelectSearch={onSelectSearch}
        onClearRecent={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Recent searches"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Popular searches"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "camera",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "laptop",
      }),
    ).toBeInTheDocument();

    expect(
      mockedSuggestionsQuery,
    ).toHaveBeenCalledWith("");

    expect(
      mockedCategoriesQuery,
    ).toHaveBeenCalledWith(false);

    fireEvent.click(
      screen.getByRole("button", {
        name: "camera",
      }),
    );

    expect(
      onSelectSearch,
    ).toHaveBeenCalledWith("camera");
  });

  it("clears recent search history", () => {
    const onClearRecent = vi.fn();

    render(
      <SearchSuggestions
        search=""
        recentSearches={["laptop"]}
        onSelectSearch={vi.fn()}
        onClearRecent={onClearRecent}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear history",
      }),
    );

    expect(
      onClearRecent,
    ).toHaveBeenCalledTimes(1);
  });

  it("shows matching product and category suggestions", () => {
    mockedSuggestionsQuery.mockReturnValue({
      isPending: false,
      data: {
        products: [
          {
            id: 1,
            title: "Laptop Pro",
          },
        ] as Product[],
        total: 1,
        skip: 0,
        limit: 5,
      },
    } as unknown as ReturnType<
      typeof useProductSuggestionsQuery
    >);

    mockedCategoriesQuery.mockReturnValue({
      isPending: false,
      data: [
        {
          slug: "laptops",
          name: "Laptops",
          url: "https://dummyjson.com/products/category/laptops",
        },
        {
          slug: "beauty",
          name: "Beauty",
          url: "https://dummyjson.com/products/category/beauty",
        },
      ] as ProductCategory[],
    } as unknown as ReturnType<
      typeof useProductCategoriesQuery
    >);

    const onSelectSearch = vi.fn();

    render(
      <SearchSuggestions
        search="lap"
        recentSearches={[]}
        onSelectSearch={onSelectSearch}
        onClearRecent={vi.fn()}
      />,
    );

    expect(
      mockedSuggestionsQuery,
    ).toHaveBeenCalledWith("lap");

    expect(
      mockedCategoriesQuery,
    ).toHaveBeenCalledWith(true);

    expect(
      screen.getByText("Laptop Pro"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Laptops"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Beauty"),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Laptop Pro",
      }),
    );

    expect(
      onSelectSearch,
    ).toHaveBeenCalledWith("Laptop Pro");
  });

  it("shows a loading state while suggestions are loading", () => {
    mockedSuggestionsQuery.mockReturnValue({
      isPending: true,
      data: undefined,
    } as unknown as ReturnType<
      typeof useProductSuggestionsQuery
    >);

    mockedCategoriesQuery.mockReturnValue({
      isPending: true,
      data: undefined,
    } as unknown as ReturnType<
      typeof useProductCategoriesQuery
    >);

    render(
      <SearchSuggestions
        search="lap"
        recentSearches={[]}
        onSelectSearch={vi.fn()}
        onClearRecent={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(
      "Finding suggestions...",
    );
  });

  it("shows a no-suggestions state when nothing matches", () => {
    render(
      <SearchSuggestions
        search="zzzzzz"
        recentSearches={[]}
        onSelectSearch={vi.fn()}
        onClearRecent={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "No suggestions found.",
      ),
    ).toBeInTheDocument();
  });
});
