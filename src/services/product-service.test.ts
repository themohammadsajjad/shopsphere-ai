import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getProductById,
  getProductCategories,
  getProducts,
  ProductServiceError,
} from "./product-service";

function mockJsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("product service", () => {
  it("loads the default product list", async () => {
    const response = {
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockJsonResponse(response));

    vi.stubGlobal("fetch", fetchMock);

    await expect(getProducts()).resolves.toEqual(response);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products?limit=12&skip=0",
    );
  });

  it("builds a product search request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        mockJsonResponse({
          products: [],
          total: 0,
          skip: 12,
          limit: 12,
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    await getProducts({
      search: "  phone  ",
      limit: 12,
      skip: 12,
      sortBy: "price",
      order: "desc",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?limit=12&skip=12&q=phone&sortBy=price&order=desc",
    );
  });

  it("builds a category request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        mockJsonResponse({
          products: [],
          total: 0,
          skip: 0,
          limit: 8,
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    await getProducts({
      category: "mens-shirts",
      limit: 8,
      sortBy: "rating",
      order: "desc",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products/category/mens-shirts?limit=8&skip=0&sortBy=rating&order=desc",
    );
  });

  it("loads a product by ID", async () => {
    const product = {
      id: 7,
      title: "Test Product",
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockJsonResponse(product));

    vi.stubGlobal("fetch", fetchMock);

    await expect(getProductById(7)).resolves.toEqual(product);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products/7",
    );
  });

  it("rejects an invalid product ID before making a request", async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    await expect(getProductById(0)).rejects.toBeInstanceOf(
      ProductServiceError,
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("loads product categories", async () => {
    const categories = [
      {
        slug: "beauty",
        name: "Beauty",
        url: "https://dummyjson.com/products/category/beauty",
      },
    ];

    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockJsonResponse(categories));

    vi.stubGlobal("fetch", fetchMock);

    await expect(getProductCategories()).resolves.toEqual(categories);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products/categories",
    );
  });

  it("throws a structured error for a failed HTTP response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockJsonResponse({}, 500)),
    );

    await expect(getProducts()).rejects.toMatchObject({
      name: "ProductServiceError",
      status: 500,
      message: "Unable to load product data.",
    });
  });

  it("throws a safe error when the network request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network failure")),
    );

    await expect(getProducts()).rejects.toMatchObject({
      name: "ProductServiceError",
      message: "Unable to connect to the product service.",
    });
  });
});
