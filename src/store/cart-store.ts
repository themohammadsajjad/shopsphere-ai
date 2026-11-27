"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AddCartItemInput,
  CartItem,
} from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (
    item: AddCartItemInput,
  ) => void;
  clearCart: () => void;
};

function createCartItemId(
  productId: number,
  variantId?: string,
) {
  return `${productId}:${variantId ?? "default"}`;
}

export const useCartStore =
  create<CartState>()(
    persist(
      (set) => ({
        items: [],

        addItem: (item) =>
          set((state) => {
            const id =
              createCartItemId(
                item.productId,
                item.variantId,
              );

            const existing =
              state.items.find(
                (cartItem) =>
                  cartItem.id === id,
              );

            if (existing) {
              return {
                items: state.items.map(
                  (cartItem) =>
                    cartItem.id === id
                      ? {
                          ...cartItem,
                          quantity: Math.min(
                            cartItem.quantity +
                              item.quantity,
                            item.stock,
                          ),
                          stock:
                            item.stock,
                          price:
                            item.price,
                        }
                      : cartItem,
                ),
              };
            }

            return {
              items: [
                ...state.items,
                {
                  ...item,
                  id,
                  quantity: Math.min(
                    Math.max(
                      item.quantity,
                      1,
                    ),
                    item.stock,
                  ),
                },
              ],
            };
          }),

        clearCart: () =>
          set({
            items: [],
          }),
      }),
      {
        name: "shopsphere-cart",
      },
    ),
  );
