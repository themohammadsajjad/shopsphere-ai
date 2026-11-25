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

import { useProductCategoriesQuery } from "@/features/products/queries";

import { CategoryFilter } from "./category-filter";

vi.mock("@/features/products/queries", () => ({
  useProductCategoriesQuery: vi.fn(),
}));

const mockedUseProductCategoriesQuery = vi.mocked(
  useProductCategoriesQuery,
);

describe("CategoryFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state", () => {
    mockedUseProductCategoriesQuery.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof useProductCategoriesQuery>);

    render(
      <CategoryFilter
        onCategoryChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("status", {
        name: "Loading product categories",
      }),
    ).toBeInTheDocument();
  });

  it("shows an error state and retries", () => {
    const refetch = vi.fn();

    mockedUseProductCategoriesQuery.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch,
    } as unknown as ReturnType<
      typeof useProductCategoriesQuery
    >);

    render(
      <CategoryFilter
        onCategoryChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "Categories could not be loaded.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry",
      }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renders categories and selects one", () => {
    const onCategoryChange = vi.fn();

    mockedUseProductCategoriesQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: [
        {
          slug: "beauty",
          name: "Beauty",
          url: "https://dummyjson.com/products/category/beauty",
        },
        {
          slug: "mens-shirts",
          name: "Mens Shirts",
          url: "https://dummyjson.com/products/category/mens-shirts",
        },
      ],
    } as unknown as ReturnType<typeof useProductCategoriesQuery>);

    render(
      <CategoryFilter
        selectedCategory="beauty"
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Beauty",
      }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mens Shirts",
      }),
    );

    expect(onCategoryChange).toHaveBeenCalledWith(
      "mens-shirts",
    );
  });

  it("clears the selected category with All", () => {
    const onCategoryChange = vi.fn();

    mockedUseProductCategoriesQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: [],
    } as unknown as ReturnType<typeof useProductCategoriesQuery>);

    render(
      <CategoryFilter
        selectedCategory="beauty"
        onCategoryChange={onCategoryChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "All",
      }),
    );

    expect(onCategoryChange).toHaveBeenCalledWith(
      undefined,
    );
  });
});
