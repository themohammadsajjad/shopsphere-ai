import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { useCheckoutStore } from "./checkout-store";

describe("checkout store", () => {
  beforeEach(() => {
    localStorage.clear();

    useCheckoutStore
      .getState()
      .resetCheckout();

    useCheckoutStore.setState({
      savedAddresses: [],
    });
  });

  it("keeps the selected checkout step", () => {
    useCheckoutStore
      .getState()
      .setStep(2);

    expect(
      useCheckoutStore.getState()
        .step,
    ).toBe(2);
  });

  it("updates customer information", () => {
    useCheckoutStore
      .getState()
      .updateCustomer(
        "phone",
        "9876543210",
      );

    expect(
      useCheckoutStore.getState()
        .customer.phone,
    ).toBe("9876543210");
  });

  it("saves the current address locally", () => {
    const store =
      useCheckoutStore.getState();

    store.updateAddress(
      "line1",
      "123 Test Street",
    );

    store.setSaveAddress(
      true,
    );

    useCheckoutStore
      .getState()
      .saveCurrentAddress();

    expect(
      useCheckoutStore.getState()
        .savedAddresses,
    ).toHaveLength(1);
  });
});
