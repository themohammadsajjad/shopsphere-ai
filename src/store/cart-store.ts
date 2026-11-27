"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getCartCoupon } from "@/features/cart/cart-coupons";
import type {
  AddCartItemInput,
  CartCoupon,
  CartItem,
} from "@/types/cart";

type CartState = {
  items: CartItem[];
  savedItems: CartItem[];
  appliedCoupon?: CartCoupon;
  couponError?: string;

  addItem: (
    item: AddCartItemInput,
  ) => void;

  removeItem: (
    id: string,
  ) => void;

  updateQuantity: (
    id: string,
    quantity: number,
  ) => void;

  syncStock: (
    id: string,
    stock: number,
  ) => void;

  confirmPrice: (
    id: string,
    price: number,
  ) => void;

  saveForLater: (
    id: string,
  ) => void;

  moveSavedToCart: (
    id: string,
  ) => void;

  removeSavedItem: (
    id: string,
  ) => void;

  applyCoupon: (
    code: string,
  ) => void;

  clearCoupon: () => void;
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
        savedItems: [],

        addItem: (item) =>
          set((state) => {
            if (
              item.stock <= 0
            ) {
              return state;
            }

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
                items:
                  state.items.map(
                    (cartItem) =>
                      cartItem.id === id
                        ? {
                            ...cartItem,
                            price:
                              item.price,
                            stock:
                              item.stock,
                            quantity:
                              Math.min(
                                cartItem.quantity +
                                  item.quantity,
                                item.stock,
                              ),
                          }
                        : cartItem,
                  ),
              };
            }

            const quantity =
              Math.min(
                Math.max(
                  item.quantity,
                  1,
                ),
                item.stock,
              );

            return {
              items: [
                ...state.items,
                {
                  ...item,
                  id,
                  quantity,
                },
              ],
            };
          }),

        removeItem: (id) =>
          set((state) => ({
            items:
              state.items.filter(
                (item) =>
                  item.id !== id,
              ),
          })),

        updateQuantity: (
          id,
          quantity,
        ) =>
          set((state) => ({
            items:
              state.items.map(
                (item) => {
                  if (
                    item.id !== id
                  ) {
                    return item;
                  }

                  if (
                    item.stock <= 0
                  ) {
                    return item;
                  }

                  return {
                    ...item,
                    quantity:
                      Math.min(
                        Math.max(
                          quantity,
                          1,
                        ),
                        item.stock,
                      ),
                  };
                },
              ),
          })),

        syncStock: (
          id,
          stock,
        ) =>
          set((state) => ({
            items:
              state.items.map(
                (item) => {
                  if (
                    item.id !== id
                  ) {
                    return item;
                  }

                  return {
                    ...item,
                    stock,
                    quantity:
                      stock > 0
                        ? Math.min(
                            item.quantity,
                            stock,
                          )
                        : item.quantity,
                  };
                },
              ),
          })),

        confirmPrice: (
          id,
          price,
        ) =>
          set((state) => ({
            items:
              state.items.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        price,
                      }
                    : item,
              ),
          })),

        saveForLater: (id) =>
          set((state) => {
            const item =
              state.items.find(
                (candidate) =>
                  candidate.id === id,
              );

            if (!item) {
              return state;
            }

            const alreadySaved =
              state.savedItems.some(
                (candidate) =>
                  candidate.id === id,
              );

            return {
              items:
                state.items.filter(
                  (candidate) =>
                    candidate.id !==
                    id,
                ),
              savedItems:
                alreadySaved
                  ? state.savedItems
                  : [
                      ...state.savedItems,
                      item,
                    ],
            };
          }),

        moveSavedToCart: (
          id,
        ) =>
          set((state) => {
            const item =
              state.savedItems.find(
                (candidate) =>
                  candidate.id === id,
              );

            if (
              !item ||
              item.stock <= 0
            ) {
              return state;
            }

            const existing =
              state.items.find(
                (candidate) =>
                  candidate.id === id,
              );

            const items =
              existing
                ? state.items.map(
                    (candidate) =>
                      candidate.id ===
                      id
                        ? {
                            ...candidate,
                            quantity:
                              Math.min(
                                candidate.quantity +
                                  item.quantity,
                                item.stock,
                              ),
                          }
                        : candidate,
                  )
                : [
                    ...state.items,
                    item,
                  ];

            return {
              items,
              savedItems:
                state.savedItems.filter(
                  (candidate) =>
                    candidate.id !==
                    id,
                ),
            };
          }),

        removeSavedItem: (
          id,
        ) =>
          set((state) => ({
            savedItems:
              state.savedItems.filter(
                (item) =>
                  item.id !== id,
              ),
          })),

        applyCoupon: (code) =>
          set(() => {
            const result =
              getCartCoupon(code);

            if (result.error) {
              return {
                appliedCoupon:
                  undefined,
                couponError:
                  result.error,
              };
            }

            return {
              appliedCoupon:
                result.coupon,
              couponError:
                undefined,
            };
          }),

        clearCoupon: () =>
          set({
            appliedCoupon:
              undefined,
            couponError:
              undefined,
          }),

        clearCart: () =>
          set({
            items: [],
            appliedCoupon:
              undefined,
            couponError:
              undefined,
          }),
      }),
      {
        name: "shopsphere-cart",
      },
    ),
  );
