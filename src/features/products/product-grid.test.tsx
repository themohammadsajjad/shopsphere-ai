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

import { ProductGrid } from "./product-grid";

vi.mock("@/features/products/queries", () => ({
  useProductsQuery: vi.fn(),
}));

vi.mock("@/features/products/product-card", () => ({
  ProductCard: ({
    product,
  }: {
    product: Product;
  }) => (
    <article data-testid={`product-${product.id}`}>
      {product.title}
    </article>
  ),
}));

const mockedUseProductsQuery = vi.mocked(
  useProductsQuery,
);

describe("ProductGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading skeleton", () => {
    mockedUseProductsQuery.mockReturnValue({
      isPending: true,
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(<ProductGrid />);

    expect(
      screen.getByRole("status", {
        name: "Loading products",
      }),
    ).toBeInTheDocument();
  });

  it("shows an error state and retries", () => {
    const refetch = vi.fn();

    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(<ProductGrid />);

    expect(
      screen.getByRole("heading", {
        name: "Products could not be loaded",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry",
      }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows an empty state when no products match", () => {
    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: false,
      isFetching: false,
      isPlaceholderData: false,
      data: {
        products: [],
        total: 0,
        skip: 0,
        limit: 12,
      },
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(<ProductGrid />);

    expect(
      screen.getByRole("heading", {
        name: "No products found",
      }),
    ).toBeInTheDocument();
  });

  it("renders product results and the total count", () => {
    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: false,
      isFetching: false,
      isPlaceholderData: false,
      data: {
        products: [
          {
            id: 1,
            title: "First Product",
          },
          {
            id: 2,
            title: "Second Product",
          },
        ] as Product[],
        total: 20,
        skip: 0,
        limit: 12,
      },
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(<ProductGrid />);

    expect(
      screen.getByText("20 products found"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("product-1"),
    ).toHaveTextContent("First Product");

    expect(
      screen.getByTestId("product-2"),
    ).toHaveTextContent("Second Product");
  });

  it("forwards product list parameters to the query hook", () => {
    mockedUseProductsQuery.mockReturnValue({
      isPending: false,
      isError: false,
      isFetching: true,
      isPlaceholderData: true,
      data: {
        products: [
          {
            id: 3,
            title: "Beauty Product",
          },
        ] as Product[],
        total: 1,
        skip: 0,
        limit: 12,
      },
    } as unknown as ReturnType<
      typeof useProductsQuery
    >);

    render(
      <ProductGrid
        params={{
          category: "beauty",
          sortBy: "price",
          order: "asc",
        }}
      />,
    );

    expect(mockedUseProductsQuery).toHaveBeenCalledWith({
      category: "beauty",
      sortBy: "price",
      order: "asc",
    });

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent("Updating results...");
  });
});
