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

import { useProductsQuery } from "@/features/products/queries";
import type { Product } from "@/types/product";

import { ProductResults } from "./product-results";

vi.mock("@/features/products/queries", () => ({
  useProductsQuery: vi.fn(),
}));

vi.mock("@/features/products/product-grid", () => ({
  ProductGrid: ({
    products,
    total,
    isUpdating,
  }: {
    products: Product[];
    total: number;
    isUpdating?: boolean;
  }) => (
    <div data-testid="product-grid">
      <span>{products.length} rendered</span>
      <span>{total} total</span>
      {isUpdating ? <span>updating</span> : null}
    </div>
  ),
}));

vi.mock("@/features/products/product-pagination", () => ({
  ProductPagination: ({
    page,
    total,
    limit,
    onPageChange,
  }: {
    page: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <span>
        page {page}, total {total}, limit {limit}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
      >
        Test next
      </button>
    </div>
  ),
}));

const mockedUseProductsQuery = vi.mocked(
  useProductsQuery,
);

describe("ProductResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading skeleton", () => {
    mockedUseProductsQuery.mockReturnValue({
      isPending: true,
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(
      <ProductResults onPageChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("status", {
        name: "Loading products",
      }),
    ).toBeInTheDocument();
  });

  it("shows the error state and retries", () => {
    const refetch = vi.fn();

    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(
      <ProductResults onPageChange={vi.fn()} />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry",
      }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows the empty state", () => {
    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        products: [],
        total: 0,
        skip: 0,
        limit: 12,
      },
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(
      <ProductResults onPageChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", {
        name: "No products found",
      }),
    ).toBeInTheDocument();
  });

  it("renders the grid and pagination from query data", () => {
    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: false,
      isFetching: false,
      isPlaceholderData: false,
      data: {
        products: [
          {
            id: 1,
            title: "Test Product",
          },
        ] as Product[],
        total: 30,
        skip: 12,
        limit: 12,
      },
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(
      <ProductResults
        params={{
          limit: 12,
          skip: 12,
        }}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByTestId("product-grid"),
    ).toHaveTextContent("1 rendered");

    expect(
      screen.getByTestId("pagination"),
    ).toHaveTextContent(
      "page 2, total 30, limit 12",
    );
  });

  it("forwards page changes", () => {
    const onPageChange = vi.fn();

    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: false,
      isFetching: false,
      isPlaceholderData: false,
      data: {
        products: [
          {
            id: 1,
            title: "Test Product",
          },
        ] as Product[],
        total: 30,
        skip: 0,
        limit: 12,
      },
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(
      <ProductResults
        params={{
          limit: 12,
          skip: 0,
        }}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Test next",
      }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
