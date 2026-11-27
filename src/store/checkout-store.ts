"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  CheckoutAddress,
  CheckoutCustomer,
  CheckoutStep,
  DeliveryMethodId,
  MockPaymentMethod,
} from "@/types/checkout";

type CheckoutState = {
  step: CheckoutStep;
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  savedAddresses:
    CheckoutAddress[];
  saveAddress: boolean;
  deliveryMethodId?:
    DeliveryMethodId;
  paymentMethod?:
    MockPaymentMethod;
  paymentError?: string;
  completedOrderId?: string;

  setStep: (
    step: CheckoutStep,
  ) => void;

  setCustomer: (
    customer: CheckoutCustomer,
  ) => void;

  updateCustomer: (
    field:
      keyof CheckoutCustomer,
    value: string,
  ) => void;

  setAddress: (
    address: CheckoutAddress,
  ) => void;

  updateAddress: (
    field:
      keyof CheckoutAddress,
    value: string,
  ) => void;

  setSaveAddress: (
    value: boolean,
  ) => void;

  saveCurrentAddress:
    () => void;

  selectSavedAddress: (
    id: string,
  ) => void;

  setDeliveryMethod: (
    id: DeliveryMethodId,
  ) => void;

  setPaymentMethod: (
    method:
      MockPaymentMethod,
  ) => void;

  setPaymentError: (
    error?: string,
  ) => void;

  setCompletedOrderId: (
    orderId: string,
  ) => void;

  resetCheckout:
    () => void;
};

const emptyCustomer:
  CheckoutCustomer = {
    name: "",
    email: "",
    phone: "",
  };

const emptyAddress:
  CheckoutAddress = {
    line1: "",
    line2: "",
    city: "",
    state: "",
    pinCode: "",
  };

export const useCheckoutStore =
  create<CheckoutState>()(
    persist(
      (set) => ({
        step: 1,
        customer:
          emptyCustomer,
        address:
          emptyAddress,
        savedAddresses: [],
        saveAddress: false,

        setStep: (step) =>
          set({ step }),

        setCustomer:
          (customer) =>
            set({
              customer,
            }),

        updateCustomer: (
          field,
          value,
        ) =>
          set((state) => ({
            customer: {
              ...state.customer,
              [field]: value,
            },
          })),

        setAddress: (
          address,
        ) =>
          set({
            address,
          }),

        updateAddress: (
          field,
          value,
        ) =>
          set((state) => ({
            address: {
              ...state.address,
              [field]: value,
            },
          })),

        setSaveAddress:
          (saveAddress) =>
            set({
              saveAddress,
            }),

        saveCurrentAddress:
          () =>
            set((state) => {
              if (
                !state.saveAddress
              ) {
                return {};
              }

              const address = {
                ...state.address,
                id:
                  state.address
                    .id ??
                  crypto.randomUUID(),
              };

              const exists =
                state.savedAddresses.some(
                  (saved) =>
                    saved.id ===
                    address.id,
                );

              return {
                address,
                savedAddresses:
                  exists
                    ? state.savedAddresses.map(
                        (saved) =>
                          saved.id ===
                          address.id
                            ? address
                            : saved,
                      )
                    : [
                        ...state.savedAddresses,
                        address,
                      ],
              };
            }),

        selectSavedAddress:
          (id) =>
            set((state) => {
              const address =
                state.savedAddresses.find(
                  (saved) =>
                    saved.id === id,
                );

              return address
                ? {
                    address: {
                      ...address,
                    },
                  }
                : {};
            }),

        setDeliveryMethod:
          (
            deliveryMethodId,
          ) =>
            set({
              deliveryMethodId,
            }),

        setPaymentMethod:
          (paymentMethod) =>
            set({
              paymentMethod,
              paymentError:
                undefined,
            }),

        setPaymentError:
          (paymentError) =>
            set({
              paymentError,
            }),

        setCompletedOrderId:
          (
            completedOrderId,
          ) =>
            set({
              completedOrderId,
              step: 6,
              paymentError:
                undefined,
            }),

        resetCheckout:
          () =>
            set({
              step: 1,
              customer:
                emptyCustomer,
              address:
                emptyAddress,
              saveAddress:
                false,
              deliveryMethodId:
                undefined,
              paymentMethod:
                undefined,
              paymentError:
                undefined,
              completedOrderId:
                undefined,
            }),
      }),
      {
        name:
          "shopsphere-checkout",
      },
    ),
  );
