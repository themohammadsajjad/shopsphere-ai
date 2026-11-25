import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  renderHook,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getProductById,
  getProductCategories,
  getProducts,
} from "@/services/product-service";

import {
  productQueryKeys,
  useProductCategoriesQuery,
  useProductQuery,
  useProductSuggestionsQuery,
  useProductsQuery,
} from "./queries";

vi.mock("@/services/product-service", () => ({
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  getProductCategories: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({
    children,
  }: {
    children: ReactNode;
  }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe("product query hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes product list query keys", () => {
    expect(
      productQueryKeys.list({
        search: "  phone  ",
        category: "beauty",
        sortBy: "price",
      }),
    ).toEqual([
      "products",
      "list",
      {
        limit: 12,
        skip: 0,
        sortBy: "price",
        order: "asc",
        search: "phone",
        category: undefined,
      },
    ]);
  });

  it("loads products with normalized parameters", async () => {
    vi.mocked(getProducts).mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    });

    const { result } = renderHook(
      () =>
        useProductsQuery({
          search: "  laptop  ",
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getProducts).toHaveBeenCalledWith({
      limit: 12,
      skip: 0,
      sortBy: undefined,
      order: undefined,
      search: "laptop",
      category: undefined,
    });
  });

  it("loads product categories", async () => {
    vi.mocked(getProductCategories).mockResolvedValue([
      {
        slug: "beauty",
        name: "Beauty",
        url: "https://dummyjson.com/products/category/beauty",
      },
    ]);

    const { result } = renderHook(
      () => useProductCategoriesQuery(),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.[0].slug).toBe("beauty");
    expect(getProductCategories).toHaveBeenCalledTimes(1);
  });

  it("loads a product by ID", async () => {
    vi.mocked(getProductById).mockResolvedValue({
      id: 7,
      title: "Test Product",
    } as Awaited<ReturnType<typeof getProductById>>);

    const { result } = renderHook(
      () => useProductQuery(7),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getProductById).toHaveBeenCalledWith(7);
  });

  it("does not request an invalid product ID", () => {
    const { result } = renderHook(
      () => useProductQuery(0),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(getProductById).not.toHaveBeenCalled();
  });

  it("loads up to five product suggestions for a trimmed search", async () => {
    vi.mocked(getProducts).mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 5,
    });

    const { result } = renderHook(
      () =>
        useProductSuggestionsQuery(
          "  laptop  ",
        ),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getProducts).toHaveBeenCalledWith({
      search: "laptop",
      limit: 5,
      skip: 0,
    });

    expect(result.current.data?.limit).toBe(5);
  });

  it("does not request suggestions for an empty search", () => {
    const { result } = renderHook(
      () =>
        useProductSuggestionsQuery("   "),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(getProducts).not.toHaveBeenCalled();
  });


  it("does not request categories when the query is disabled", () => {
    const { result } = renderHook(
      () => useProductCategoriesQuery(false),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(
      getProductCategories,
    ).not.toHaveBeenCalled();
  });

});
