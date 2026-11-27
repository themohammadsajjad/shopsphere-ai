"use client";

import {
  type FormEvent,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import {
  DELIVERY_METHODS,
  MOCK_PAYMENT_METHODS,
  calculateCheckoutTotals,
  getDeliveryMethod,
  hasCheckoutErrors,
  validateAddress,
  validateCustomer,
  type CheckoutErrors,
} from "@/features/checkout/checkout-data";
import { createOrder } from "@/features/orders/order-utils";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { useOrderStore } from "@/store/order-store";
import type {
  CheckoutStep,
} from "@/types/checkout";
import { formatInr } from "@/utils/currency";

const STEPS: Array<{
  step: CheckoutStep;
  label: string;
}> = [
  {
    step: 1,
    label:
      "Customer Information",
  },
  {
    step: 2,
    label: "Address",
  },
  {
    step: 3,
    label:
      "Delivery Method",
  },
  {
    step: 4,
    label: "Order Summary",
  },
  {
    step: 5,
    label: "Mock Payment",
  },
  {
    step: 6,
    label: "Confirmation",
  },
];

function CheckoutProgress({
  currentStep,
}: {
  currentStep:
    CheckoutStep;
}) {
  return (
    <ol
      aria-label="Checkout progress"
      className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6"
    >
      {STEPS.map(
        ({
          step,
          label,
        }) => (
          <li
            key={step}
            className={`rounded-2xl border p-3 text-sm ${
              step ===
              currentStep
                ? "bg-foreground text-background"
                : step <
                    currentStep
                  ? "bg-muted/70"
                  : "bg-background/50 text-muted-foreground"
            }`}
          >
            <span className="block text-xs opacity-70">
              Step {step}
            </span>

            <span className="mt-1 block font-medium">
              {label}
            </span>
          </li>
        ),
      )}
    </ol>
  );
}

function FieldError({
  error,
}: {
  error?: string;
}) {
  return error ? (
    <p
      role="alert"
      className="mt-1 text-sm text-destructive"
    >
      {error}
    </p>
  ) : null;
}

export function CheckoutFlow() {
  const [errors, setErrors] =
    useState<CheckoutErrors>(
      {},
    );

  const session =
    useAuthStore(
      (state) =>
        state.session,
    );

  const logout =
    useAuthStore(
      (state) =>
        state.logout,
    );

  const items =
    useCartStore(
      (state) =>
        state.items,
    );

  const appliedCoupon =
    useCartStore(
      (state) =>
        state.appliedCoupon,
    );

  const clearCart =
    useCartStore(
      (state) =>
        state.clearCart,
    );

  const step =
    useCheckoutStore(
      (state) =>
        state.step,
    );

  const customer =
    useCheckoutStore(
      (state) =>
        state.customer,
    );

  const address =
    useCheckoutStore(
      (state) =>
        state.address,
    );

  const savedAddresses =
    useCheckoutStore(
      (state) =>
        state.savedAddresses,
    );

  const saveAddress =
    useCheckoutStore(
      (state) =>
        state.saveAddress,
    );

  const deliveryMethodId =
    useCheckoutStore(
      (state) =>
        state.deliveryMethodId,
    );

  const paymentMethod =
    useCheckoutStore(
      (state) =>
        state.paymentMethod,
    );

  const paymentError =
    useCheckoutStore(
      (state) =>
        state.paymentError,
    );

  const completedOrderId =
    useCheckoutStore(
      (state) =>
        state.completedOrderId,
    );

  const setStep =
    useCheckoutStore(
      (state) =>
        state.setStep,
    );

  const setCustomer =
    useCheckoutStore(
      (state) =>
        state.setCustomer,
    );

  const updateCustomer =
    useCheckoutStore(
      (state) =>
        state.updateCustomer,
    );

  const updateAddress =
    useCheckoutStore(
      (state) =>
        state.updateAddress,
    );

  const setSaveAddress =
    useCheckoutStore(
      (state) =>
        state.setSaveAddress,
    );

  const saveCurrentAddress =
    useCheckoutStore(
      (state) =>
        state.saveCurrentAddress,
    );

  const selectSavedAddress =
    useCheckoutStore(
      (state) =>
        state.selectSavedAddress,
    );

  const setDeliveryMethod =
    useCheckoutStore(
      (state) =>
        state.setDeliveryMethod,
    );

  const setPaymentMethod =
    useCheckoutStore(
      (state) =>
        state.setPaymentMethod,
    );

  const setPaymentError =
    useCheckoutStore(
      (state) =>
        state.setPaymentError,
    );

  const setCompletedOrderId =
    useCheckoutStore(
      (state) =>
        state.setCompletedOrderId,
    );

  const resetCheckout =
    useCheckoutStore(
      (state) =>
        state.resetCheckout,
    );

  const addOrder =
    useOrderStore(
      (state) =>
        state.addOrder,
    );

  const orders =
    useOrderStore(
      (state) =>
        state.orders,
    );

  const checkoutHydrated =
    useSyncExternalStore(
      (change) =>
        useCheckoutStore.persist.onFinishHydration(
          change,
        ),
      () =>
        useCheckoutStore.persist.hasHydrated(),
      () => false,
    );

  const cartHydrated =
    useSyncExternalStore(
      (change) =>
        useCartStore.persist.onFinishHydration(
          change,
        ),
      () =>
        useCartStore.persist.hasHydrated(),
      () => false,
    );

  useEffect(() => {
    if (
      !session?.user ||
      customer.name ||
      customer.email
    ) {
      return;
    }

    setCustomer({
      ...customer,
      name:
        session.user.name,
      email:
        session.user.email,
      phone:
        session.user.phone ??
        customer.phone,
    });
  }, [
    customer,
    session,
    setCustomer,
  ]);

  useEffect(() => {
    if (
      !session ||
      step === 6
    ) {
      return;
    }

    const remaining =
      session.expiresAt -
      Date.now();

    const timer =
      window.setTimeout(
        () => {
          logout();
        },
        Math.max(
          0,
          remaining,
        ),
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    logout,
    session,
    step,
  ]);

  if (
    !checkoutHydrated ||
    !cartHydrated
  ) {
    return (
      <div
        role="status"
        className="h-96 animate-pulse rounded-3xl border bg-muted/40"
      />
    );
  }

  const delivery =
    getDeliveryMethod(
      deliveryMethodId,
    );

  const totals =
    calculateCheckoutTotals(
      items,
      appliedCoupon,
      deliveryMethodId,
    );

  const completedOrder =
    completedOrderId
      ? orders.find(
          (order) =>
            order.id ===
            completedOrderId,
        )
      : undefined;

  if (
    items.length === 0 &&
    step !== 6
  ) {
    return (
      <section className="glass-panel rounded-3xl border p-8 text-center">
        <h2 className="text-2xl font-semibold">
          Your cart is empty
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Add products before
          starting checkout.
        </p>

        <Link
          href="/products"
          className={buttonVariants({
            className:
              "mt-5",
          })}
        >
          Browse Products
        </Link>
      </section>
    );
  }

  function submitCustomer(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors =
      validateCustomer(
        customer,
      );

    setErrors(nextErrors);

    if (
      hasCheckoutErrors(
        nextErrors,
      )
    ) {
      return;
    }

    setErrors({});
    setStep(2);
  }

  function submitAddress(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors =
      validateAddress(
        address,
      );

    setErrors(nextErrors);

    if (
      hasCheckoutErrors(
        nextErrors,
      )
    ) {
      return;
    }

    saveCurrentAddress();
    setErrors({});
    setStep(3);
  }

  function continueDelivery() {
    if (
      !deliveryMethodId
    ) {
      setErrors({
        delivery:
          "Choose a delivery method.",
      });

      return;
    }

    setErrors({});
    setStep(4);
  }

  function continueToPayment() {
    setPaymentError(
      undefined,
    );
    setStep(5);
  }

  function completePayment() {
    if (
      !paymentMethod ||
      !deliveryMethodId
    ) {
      setPaymentError(
        "Choose a mock payment method before continuing.",
      );

      return;
    }

    const order =
      createOrder({
        items,
        coupon:
          appliedCoupon,
        customer,
        address,
        deliveryMethodId,
        paymentMethod,
      });

    addOrder(order);
    setCompletedOrderId(
      order.id,
    );
    clearCart();
  }

  function startAnotherOrder() {
    resetCheckout();
  }

  return (
    <div className="space-y-8">
      <CheckoutProgress
        currentStep={step}
      />

      {step === 1 ? (
        <form
          onSubmit={
            submitCustomer
          }
          className="glass-panel rounded-3xl border p-5 sm:p-7"
          noValidate
        >
          <h2 className="text-2xl font-semibold">
            Customer Information
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Tell us who this
            simulated order belongs
            to.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="checkout-name"
                className="text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="checkout-name"
                value={
                  customer.name
                }
                onChange={(
                  event,
                ) =>
                  updateCustomer(
                    "name",
                    event.target
                      .value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />

              <FieldError
                error={
                  errors.name
                }
              />
            </div>

            <div>
              <label
                htmlFor="checkout-email"
                className="text-sm font-medium"
              >
                Email
              </label>

              <input
                id="checkout-email"
                type="email"
                value={
                  customer.email
                }
                onChange={(
                  event,
                ) =>
                  updateCustomer(
                    "email",
                    event.target
                      .value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />

              <FieldError
                error={
                  errors.email
                }
              />
            </div>

            <div>
              <label
                htmlFor="checkout-phone"
                className="text-sm font-medium"
              >
                Phone
              </label>

              <input
                id="checkout-phone"
                inputMode="numeric"
                maxLength={10}
                value={
                  customer.phone
                }
                onChange={(
                  event,
                ) =>
                  updateCustomer(
                    "phone",
                    event.target.value.replace(
                      /\D/g,
                      "",
                    ),
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />

              <FieldError
                error={
                  errors.phone
                }
              />
            </div>
          </div>

          <div className="mt-7 flex justify-end">
            <Button type="submit">
              Continue to Address
            </Button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form
          onSubmit={
            submitAddress
          }
          className="glass-panel rounded-3xl border p-5 sm:p-7"
          noValidate
        >
          <h2 className="text-2xl font-semibold">
            Address
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This checkout draft is
            saved locally, including
            this step and entered
            address.
          </p>

          {savedAddresses.length >
          0 ? (
            <div className="mt-5">
              <p className="text-sm font-medium">
                Saved addresses
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {savedAddresses.map(
                  (
                    saved,
                    index,
                  ) => (
                    <Button
                      key={
                        saved.id
                      }
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        saved.id &&
                        selectSavedAddress(
                          saved.id,
                        )
                      }
                    >
                      Use address{" "}
                      {index + 1}
                    </Button>
                  ),
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="address-line1"
                className="text-sm font-medium"
              >
                Address line 1
              </label>

              <input
                id="address-line1"
                value={
                  address.line1
                }
                onChange={(
                  event,
                ) =>
                  updateAddress(
                    "line1",
                    event.target
                      .value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />

              <FieldError
                error={
                  errors.line1
                }
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address-line2"
                className="text-sm font-medium"
              >
                Address line 2
                (optional)
              </label>

              <input
                id="address-line2"
                value={
                  address.line2
                }
                onChange={(
                  event,
                ) =>
                  updateAddress(
                    "line2",
                    event.target
                      .value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />
            </div>

            <div>
              <label
                htmlFor="address-city"
                className="text-sm font-medium"
              >
                City
              </label>

              <input
                id="address-city"
                value={
                  address.city
                }
                onChange={(
                  event,
                ) =>
                  updateAddress(
                    "city",
                    event.target
                      .value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />

              <FieldError
                error={
                  errors.city
                }
              />
            </div>

            <div>
              <label
                htmlFor="address-state"
                className="text-sm font-medium"
              >
                State
              </label>

              <input
                id="address-state"
                value={
                  address.state
                }
                onChange={(
                  event,
                ) =>
                  updateAddress(
                    "state",
                    event.target
                      .value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />

              <FieldError
                error={
                  errors.state
                }
              />
            </div>

            <div>
              <label
                htmlFor="address-pin"
                className="text-sm font-medium"
              >
                PIN code
              </label>

              <input
                id="address-pin"
                inputMode="numeric"
                maxLength={6}
                value={
                  address.pinCode
                }
                onChange={(
                  event,
                ) =>
                  updateAddress(
                    "pinCode",
                    event.target.value.replace(
                      /\D/g,
                      "",
                    ),
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border bg-background px-3"
              />

              <FieldError
                error={
                  errors.pinCode
                }
              />
            </div>
          </div>

          <label className="mt-6 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={
                saveAddress
              }
              onChange={(
                event,
              ) =>
                setSaveAddress(
                  event.target
                    .checked,
                )
              }
            />
            Save this address on
            this device
          </label>

          <div className="mt-7 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setStep(1)
              }
            >
              Back
            </Button>

            <Button type="submit">
              Continue to Delivery
            </Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <section className="glass-panel rounded-3xl border p-5 sm:p-7">
          <h2 className="text-2xl font-semibold">
            Delivery Method
          </h2>

          <div className="mt-6 grid gap-3">
            {DELIVERY_METHODS.map(
              (method) => (
                <button
                  key={
                    method.id
                  }
                  type="button"
                  aria-pressed={
                    deliveryMethodId ===
                    method.id
                  }
                  onClick={() =>
                    setDeliveryMethod(
                      method.id,
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    deliveryMethodId ===
                    method.id
                      ? "border-foreground bg-muted"
                      : "hover:border-foreground/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">
                      {
                        method.label
                      }
                    </span>

                    <span className="font-medium">
                      {method.cost ===
                      0
                        ? "Free"
                        : formatInr(
                            method.cost,
                          )}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {
                      method.description
                    }
                  </p>
                </button>
              ),
            )}
          </div>

          <FieldError
            error={
              errors.delivery
            }
          />

          <div className="mt-7 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setStep(2)
              }
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={
                continueDelivery
              }
            >
              Review Order
            </Button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="glass-panel rounded-3xl border p-5 sm:p-7">
          <h2 className="text-2xl font-semibold">
            Order Summary
          </h2>

          <div className="mt-6 space-y-3">
            {items.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="flex justify-between gap-4 rounded-2xl border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {
                        item.title
                      }
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Qty{" "}
                      {
                        item.quantity
                      }
                      {item.variantLabel
                        ? ` · ${item.variantLabel}`
                        : ""}
                    </p>
                  </div>

                  <p className="font-medium">
                    {formatInr(
                      item.price *
                        item.quantity,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="mt-6 space-y-3 border-t pt-5 text-sm">
            <div className="flex justify-between">
              <span>
                Subtotal
              </span>
              <span>
                {formatInr(
                  totals.subtotal,
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Discount
              </span>
              <span>
                −{" "}
                {formatInr(
                  totals.discount,
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                {
                  delivery.label
                }
              </span>
              <span>
                {totals.shipping ===
                0
                  ? "Free"
                  : formatInr(
                      totals.shipping,
                    )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                {formatInr(
                  totals.tax,
                )}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>
                {formatInr(
                  totals.total,
                )}
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setStep(3)
              }
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={
                continueToPayment
              }
            >
              Continue to Payment
            </Button>
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="glass-panel rounded-3xl border p-5 sm:p-7">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Test mode only
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Mock Payment
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            This is a simulated
            payment step. No real
            card number, CVV, bank
            login, or UPI PIN is
            requested or
            transmitted.
          </p>

          <div className="mt-6 grid gap-3">
            {MOCK_PAYMENT_METHODS.map(
              (method) => (
                <button
                  key={
                    method.id
                  }
                  type="button"
                  aria-pressed={
                    paymentMethod ===
                    method.id
                  }
                  onClick={() =>
                    setPaymentMethod(
                      method.id,
                    )
                  }
                  className={`rounded-2xl border p-4 text-left ${
                    paymentMethod ===
                    method.id
                      ? "border-foreground bg-muted"
                      : "hover:border-foreground/50"
                  }`}
                >
                  <p className="font-medium">
                    {
                      method.label
                    }
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {
                      method.description
                    }
                  </p>
                </button>
              ),
            )}
          </div>

          {paymentError ? (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              {paymentError}

              <div className="mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPaymentError(
                      undefined,
                    )
                  }
                >
                  Retry mock payment
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setStep(4)
              }
            >
              Back
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setPaymentError(
                  "Mock payment failed. No charge was made. Retry this simulated payment.",
                )
              }
            >
              Simulate failure
            </Button>

            <Button
              type="button"
              onClick={
                completePayment
              }
            >
              Complete mock payment
            </Button>
          </div>
        </section>
      ) : null}

      {step === 6 ? (
        <section className="glass-panel rounded-3xl border p-6 text-center sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Order confirmed
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            Thank you for your
            order
          </h2>

          {completedOrder ? (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Order ID
              </p>

              <p className="mt-1 font-mono text-lg font-semibold">
                {
                  completedOrder.id
                }
              </p>

              <p className="mt-4 text-lg font-semibold">
                {formatInr(
                  completedOrder
                    .totals.total,
                )}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Expected delivery{" "}
                {new Date(
                  completedOrder.expectedDeliveryDate,
                ).toLocaleDateString(
                  "en-IN",
                )}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/orders/${completedOrder.id}`}
                  className={buttonVariants(
                    {},
                  )}
                >
                  View order
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    startAnotherOrder
                  }
                >
                  Start new checkout
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Your order is saved
              in order history.
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}
