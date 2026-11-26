"use client";

import {
  useCallback,
  useMemo,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { CategoryFilter } from "@/features/products/category-filter";
import { FilteredProductResults } from "@/features/products/filtered-product-results";
import { ProductSearch } from "@/features/products/product-search";
import { ProductSort } from "@/features/products/product-sort";
import {
  createProductDiscoveryParams,
  parseProductDiscoveryState,
  parseProductFilters,
  type ProductDiscoveryState,
} from "@/features/products/url-state";
import type { ProductFilters } from "@/types/product";

const PRODUCTS_PER_PAGE = 12;

export function ProductDiscovery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(
    () =>
      parseProductDiscoveryState(
        new URLSearchParams(
          searchParams.toString(),
        ),
      ),
    [searchParams],
  );

  const filters = useMemo(
    () =>
      parseProductFilters(
        new URLSearchParams(
          searchParams.toString(),
        ),
      ),
    [searchParams],
  );

  const updateUrl = useCallback(
    (
      nextState: ProductDiscoveryState,
      mode: "push" | "replace" = "push",
      nextFilters: ProductFilters =
        filters,
    ) => {
      const params =
        createProductDiscoveryParams(
          nextState,
          nextFilters,
        );

      const query = params.toString();

      const nextUrl = query
        ? `${pathname}?${query}`
        : pathname;

      const currentQuery =
        searchParams.toString();

      const currentUrl = currentQuery
        ? `${pathname}?${currentQuery}`
        : pathname;

      if (nextUrl === currentUrl) {
        return;
      }

      if (mode === "replace") {
        router.replace(nextUrl, {
          scroll: false,
        });
        return;
      }

      router.push(nextUrl, {
        scroll: false,
      });
    },
    [
      filters,
      pathname,
      router,
      searchParams,
    ],
  );

  const handleSearchChange = useCallback(
    (search?: string) => {
      updateUrl(
        {
          ...state,
          search,
          category: search
            ? undefined
            : state.category,
          page: 1,
        },
        "replace",
      );
    },
    [state, updateUrl],
  );

  const handleCategoryChange =
    useCallback(
      (category?: string) => {
        updateUrl({
          ...state,
          search: undefined,
          category,
          page: 1,
        });
      },
      [state, updateUrl],
    );

  const handleSortChange = useCallback(
    (
      sortBy:
        | ProductDiscoveryState["sortBy"]
        | undefined,
      order:
        | ProductDiscoveryState["order"]
        | undefined,
    ) => {
      updateUrl({
        ...state,
        sortBy,
        order,
        page: 1,
      });
    },
    [state, updateUrl],
  );

  const handleFiltersChange =
    useCallback(
      (nextFilters: ProductFilters) => {
        updateUrl(
          {
            ...state,
            page: 1,
          },
          "push",
          nextFilters,
        );
      },
      [state, updateUrl],
    );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({
        ...state,
        page,
      });
    },
    [state, updateUrl],
  );

  const productParams = {
    search: state.search,
    category: state.category,
    sortBy: state.sortBy,
    order: state.order,
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-3xl border p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <ProductSearch
            key={state.search ?? ""}
            initialValue={
              state.search ?? ""
            }
            onSearchChange={
              handleSearchChange
            }
          />

          <ProductSort
            sortBy={state.sortBy}
            order={state.order}
            onSortChange={
              handleSortChange
            }
          />
        </div>

        <div className="mt-5 border-t pt-5">
          <CategoryFilter
            selectedCategory={
              state.category
            }
            onCategoryChange={
              handleCategoryChange
            }
          />
        </div>
      </div>

      <FilteredProductResults
        params={productParams}
        filters={filters}
        page={state.page}
        limit={PRODUCTS_PER_PAGE}
        onFiltersChange={
          handleFiltersChange
        }
        onPageChange={
          handlePageChange
        }
      />
    </div>
  );
}
