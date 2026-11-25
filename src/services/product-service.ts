import type {
  Product,
  ProductCategory,
  ProductListParams,
  ProductsResponse,
} from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://dummyjson.com";

export class ProductServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ProductServiceError";
    this.status = status;
  }
}

function buildProductsUrl(params: ProductListParams = {}) {
  const {
    limit = 12,
    skip = 0,
    sortBy,
    order,
    category,
    search,
  } = params;

  let pathname = "/products";

  if (search?.trim()) {
    pathname = "/products/search";
  } else if (category?.trim()) {
    pathname = `/products/category/${encodeURIComponent(category.trim())}`;
  }

  const url = new URL(pathname, API_BASE_URL);

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("skip", String(skip));

  if (search?.trim()) {
    url.searchParams.set("q", search.trim());
  }

  if (sortBy) {
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("order", order ?? "asc");
  }

  return url.toString();
}

async function requestJson<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new ProductServiceError(
      "Unable to connect to the product service.",
    );
  }

  if (!response.ok) {
    throw new ProductServiceError(
      "Unable to load product data.",
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export async function getProducts(
  params: ProductListParams = {},
): Promise<ProductsResponse> {
  return requestJson<ProductsResponse>(buildProductsUrl(params));
}

export async function getProductById(id: number): Promise<Product> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ProductServiceError("Invalid product ID.");
  }

  return requestJson<Product>(
    `${API_BASE_URL}/products/${encodeURIComponent(String(id))}`,
  );
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  return requestJson<ProductCategory[]>(
    `${API_BASE_URL}/products/categories`,
  );
}
