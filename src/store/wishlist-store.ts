"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: number[];
  toggleProduct: (
    productId: number,
  ) => void;
  clearWishlist: () => void;
};

export const useWishlistStore =
  create<WishlistState>()(
    persist(
      (set) => ({
        productIds: [],

        toggleProduct: (
          productId,
        ) =>
          set((state) => ({
            productIds:
              state.productIds.includes(
                productId,
              )
                ? state.productIds.filter(
                    (id) =>
                      id !== productId,
                  )
                : [
                    ...state.productIds,
                    productId,
                  ],
          })),

        clearWishlist: () =>
          set({
            productIds: [],
          }),
      }),
      {
        name: "shopsphere-wishlist",
      },
    ),
  );
