"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  getProductById,
  getProductCategories,
  getProducts,
} from "@/services/product-service";
import type { ProductListParams } from "@/types/product";

function normalizeProductListParams(
  params: ProductListParams = {},
): ProductListParams {
  const search = params.search?.trim() || undefined;

  return {
    limit: params.limit ?? 12,
    skip: params.skip ?? 0,
    sortBy: params.sortBy,
    order: params.sortBy ? params.order ?? "asc" : undefined,
    search,
    category: search
      ? undefined
      : params.category?.trim() || undefined,
  };
}

export const productQueryKeys = {
  all: ["products"] as const,

  lists: () => [...productQueryKeys.all, "list"] as const,

  list: (params: ProductListParams = {}) =>
    [
      ...productQueryKeys.lists(),
      normalizeProductListParams(params),
    ] as const,

  categories: () =>
    [...productQueryKeys.all, "categories"] as const,

  details: () =>
    [...productQueryKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...productQueryKeys.details(), id] as const,
};

export function useProductsQuery(
  params: ProductListParams = {},
) {
  const normalizedParams = normalizeProductListParams(params);

  return useQuery({
    queryKey: productQueryKeys.list(normalizedParams),
    queryFn: () => getProducts(normalizedParams),
    placeholderData: keepPreviousData,
  });
}

export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: getProductCategories,
  });
}

export function useProductQuery(id: number) {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
