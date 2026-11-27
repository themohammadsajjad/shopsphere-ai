import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateCheckoutTotals,
  validateAddress,
  validateCustomer,
} from "./checkout-data";

describe("checkout data", () => {
  it("validates customer information", () => {
    expect(
      validateCustomer({
        name: "",
        email: "bad",
        phone: "12",
      }),
    ).toMatchObject({
      name:
        "Enter your full name.",
      email:
        "Enter a valid email address.",
      phone:
        "Enter a valid 10-digit phone number.",
    });
  });

  it("accepts valid customer information", () => {
    expect(
      validateCustomer({
        name:
          "Demo Customer",
        email:
          "demo@example.com",
        phone:
          "9876543210",
      }),
    ).toEqual({});
  });

  it("validates shipping address", () => {
    expect(
      validateAddress({
        line1: "x",
        line2: "",
        city: "",
        state: "",
        pinCode: "123",
      }),
    ).toHaveProperty(
      "pinCode",
    );
  });

  it("uses selected delivery cost in totals", () => {
    expect(
      calculateCheckoutTotals(
        [
          {
            id: "1:default",
            productId: 1,
            title: "Product",
            price: 1000,
            thumbnail:
              "/file.svg",
            quantity: 1,
            stock: 5,
          },
        ],
        undefined,
        "express",
      ),
    ).toEqual({
      subtotal: 1000,
      discount: 0,
      shipping: 199,
      tax: 50,
      total: 1249,
    });
  });
});
