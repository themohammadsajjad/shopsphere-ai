"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Product,
} from "@/types/product";

type AdminCatalogueState = {
  upsertedProducts:
    Product[];
  deletedIds:
    number[];
  categories:
    string[];

  upsertProduct: (
    product: Product,
  ) => void;

  deleteProduct: (
    productId: number,
  ) => void;

  addCategory: (
    category: string,
  ) => void;

  resetCatalogue:
    () => void;
};

export const useAdminCatalogueStore =
  create<AdminCatalogueState>()(
    persist(
      (set) => ({
        upsertedProducts: [],
        deletedIds: [],
        categories: [],

        upsertProduct:
          (product) =>
            set(
              (state) => ({
                upsertedProducts: [
                  product,
                  ...state.upsertedProducts.filter(
                    (
                      item,
                    ) =>
                      item.id !==
                      product.id,
                  ),
                ],
                deletedIds:
                  state.deletedIds.filter(
                    (id) =>
                      id !==
                      product.id,
                  ),
              }),
            ),

        deleteProduct:
          (productId) =>
            set(
              (state) => ({
                deletedIds: [
                  ...new Set([
                    ...state.deletedIds,
                    productId,
                  ]),
                ],
                upsertedProducts:
                  state.upsertedProducts.filter(
                    (
                      item,
                    ) =>
                      item.id !==
                      productId,
                  ),
              }),
            ),

        addCategory:
          (category) =>
            set(
              (state) => {
                const value =
                  category
                    .trim()
                    .toLowerCase()
                    .replaceAll(
                      " ",
                      "-",
                    );

                if (
                  !value ||
                  state.categories.includes(
                    value,
                  )
                ) {
                  return state;
                }

                return {
                  categories: [
                    ...state.categories,
                    value,
                  ],
                };
              },
            ),

        resetCatalogue:
          () =>
            set({
              upsertedProducts:
                [],
              deletedIds: [],
              categories: [],
            }),
      }),
      {
        name:
          "shopsphere-admin-catalogue",
      },
    ),
  );
