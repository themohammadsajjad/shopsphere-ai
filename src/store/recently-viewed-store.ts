"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types/product";

type RecentlyViewedState = {
  products: Product[];
  addProduct: (product: Product) => void;
  clearProducts: () => void;
};

const MAX_RECENT_PRODUCTS = 12;

export const useRecentlyViewedStore =
  create<RecentlyViewedState>()(
    persist(
      (set) => ({
        products: [],

        addProduct: (product) =>
          set((state) => ({
            products: [
              product,
              ...state.products.filter(
                (item) =>
                  item.id !== product.id,
              ),
            ].slice(
              0,
              MAX_RECENT_PRODUCTS,
            ),
          })),

        clearProducts: () =>
          set({
            products: [],
          }),
      }),
      {
        name:
          "shopsphere-recently-viewed",
      },
    ),
  );
