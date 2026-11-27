import {
  expect,
  test,
  type Page,
} from "@playwright/test";

function makeSession(
  expiresInMs =
    60 * 60 * 1000,
) {
  return {
    token:
      "test.checkout.session",
    expiresAt:
      Date.now() +
      expiresInMs,
    user: {
      id:
        "demo-customer",
      name:
        "Demo Customer",
      email:
        "customer@shopsphere.dev",
      role:
        "customer",
      createdAt:
        "1970-01-01T00:00:00.000Z",
    },
  };
}

const cartItem = {
  id: "1:default",
  productId: 1,
  title:
    "Checkout Test Product",
  price: 2000,
  thumbnail: "/file.svg",
  quantity: 2,
  stock: 5,
};

async function seedAuthAndCart(
  page: Page,
  expiresInMs?: number,
) {
  await page.addInitScript(
    ({
      session,
      item,
    }) => {
      if (
        sessionStorage.getItem(
          "checkout-e2e-seeded",
        )
      ) {
        return;
      }

      sessionStorage.setItem(
        "checkout-e2e-seeded",
        "true",
      );

      localStorage.setItem(
        "shopsphere.auth.session",
        JSON.stringify(
          session,
        ),
      );

      localStorage.setItem(
        "shopsphere-cart",
        JSON.stringify({
          state: {
            items: [item],
            savedItems: [],
          },
          version: 0,
        }),
      );

      localStorage.removeItem(
        "shopsphere-checkout",
      );

      localStorage.removeItem(
        "shopsphere-orders",
      );
    },
    {
      session:
        makeSession(
          expiresInMs,
        ),
      item: cartItem,
    },
  );
}

async function seedPaymentStep(
  page: Page,
  expiresInMs =
    60 * 60 * 1000,
) {
  await page.addInitScript(
    ({
      session,
      item,
    }) => {
      if (
        sessionStorage.getItem(
          "checkout-e2e-seeded",
        )
      ) {
        return;
      }

      sessionStorage.setItem(
        "checkout-e2e-seeded",
        "true",
      );

      localStorage.setItem(
        "shopsphere.auth.session",
        JSON.stringify(
          session,
        ),
      );

      localStorage.setItem(
        "shopsphere-cart",
        JSON.stringify({
          state: {
            items: [item],
            savedItems: [],
          },
          version: 0,
        }),
      );

      localStorage.setItem(
        "shopsphere-checkout",
        JSON.stringify({
          state: {
            step: 5,
            customer: {
              name:
                "Demo Customer",
              email:
                "customer@shopsphere.dev",
              phone:
                "9876543210",
            },
            address: {
              line1:
                "123 Test Street",
              line2: "",
              city:
                "Ludhiana",
              state:
                "Punjab",
              pinCode:
                "141001",
            },
            savedAddresses: [],
            saveAddress:
              false,
            deliveryMethodId:
              "express",
          },
          version: 0,
        }),
      );

      localStorage.removeItem(
        "shopsphere-orders",
      );
    },
    {
      session:
        makeSession(
          expiresInMs,
        ),
      item: cartItem,
    },
  );
}

test(
  "full checkout restores Address after refresh and creates an order",
  async ({ page }) => {
    await seedAuthAndCart(
      page,
    );

    await page.goto(
      "/checkout",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Customer Information",
        },
      ),
    ).toBeVisible();

    await page
      .getByLabel("Phone")
      .fill(
        "9876543210",
      );

    await page
      .getByRole("button", {
        name:
          "Continue to Address",
      })
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name: "Address",
        },
      ),
    ).toBeVisible();

    await page
      .getByLabel(
        "Address line 1",
      )
      .fill(
        "123 Test Street",
      );

    await page
      .getByLabel("City")
      .fill("Ludhiana");

    await page
      .getByLabel("State")
      .fill("Punjab");

    await page
      .getByLabel("PIN code")
      .fill("141001");

    await page.reload();

    await expect(
      page.getByRole(
        "heading",
        {
          name: "Address",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByLabel(
        "Address line 1",
      ),
    ).toHaveValue(
      "123 Test Street",
    );

    await expect(
      page.getByLabel("City"),
    ).toHaveValue(
      "Ludhiana",
    );

    await page
      .getByRole("button", {
        name:
          "Continue to Delivery",
      })
      .click();

    await page
      .getByRole("button", {
        name:
          /Express delivery/i,
      })
      .click();

    await page
      .getByRole("button", {
        name:
          "Review Order",
      })
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Order Summary",
        },
      ),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name:
          "Continue to Payment",
      })
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Mock Payment",
        },
      ),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: /Mock Card/i,
      })
      .click();

    await page
      .getByRole("button", {
        name:
          "Complete mock payment",
      })
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Thank you for your order",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        /SS-[A-Z0-9]+-[A-Z0-9]+/,
      ),
    ).toBeVisible();

    await page
      .getByRole("link", {
        name:
          "View order",
      })
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Order Tracking",
          exact: true,
          level: 2,
        },
      ),
    ).toBeVisible();

    await expect(
      page
        .getByRole("region", {
          name: "Order tracking",
        })
        .getByText(
          "Order Placed",
          {
            exact: true,
          },
        ),
    ).toBeVisible();
  },
);

test(
  "mock payment failure stays on payment and can retry",
  async ({ page }) => {
    await seedPaymentStep(
      page,
    );

    await page.goto(
      "/checkout",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Mock Payment",
        },
      ),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name:
          "Simulate failure",
      })
      .click();

    await expect(
      page
        .getByRole("alert")
        .filter({
          hasText:
            "Mock payment failed",
        }),
    ).toContainText(
      "Mock payment failed",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Mock Payment",
        },
      ),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name:
          "Retry mock payment",
      })
      .click();

    await expect(
      page.getByText(
        /Mock payment failed/,
      ),
    ).toHaveCount(0);

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Mock Payment",
        },
      ),
    ).toBeVisible();
  },
);

test(
  "session expiry at payment returns to login and restores payment step",
  async ({ page }) => {
    await seedPaymentStep(
      page,
      3000,
    );

    await page.goto(
      "/checkout",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Mock Payment",
        },
      ),
    ).toBeVisible();

    await expect(
      page,
    ).toHaveURL(
      /\/login\?next=%2Fcheckout/,
      {
        timeout: 8000,
      },
    );

    await page
      .getByRole("button", {
        name:
          "Customer demo",
      })
      .click();

    await page
      .getByRole("button", {
        name: "Sign in",
      })
      .click();

    await expect(
      page,
    ).toHaveURL(
      /\/checkout$/,
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Mock Payment",
        },
      ),
    ).toBeVisible();
  },
);

test(
  "shipped order shows completed and upcoming tracking stages",
  async ({ page }) => {
    await page.addInitScript(
      ({ session }) => {
        const start =
          new Date(
            "2026-11-27T10:00:00.000Z",
          );

        const order = {
          id:
            "SS-SHIPPED-TEST",
          createdAt:
            start.toISOString(),
          expectedDeliveryDate:
            "2026-12-01T10:00:00.000Z",
          status:
            "Shipped",
          statusHistory: [
            "Order Placed",
            "Confirmed",
            "Packed",
            "Shipped",
          ].map(
            (
              status,
              index,
            ) => ({
              status,
              timestamp:
                new Date(
                  start.getTime() +
                    index *
                      60 *
                      60 *
                      1000,
                ).toISOString(),
            }),
          ),
          items: [
            {
              id:
                "1:default",
              productId: 1,
              title:
                "Tracked Product",
              price: 2000,
              thumbnail:
                "/file.svg",
              quantity: 1,
              stock: 5,
            },
          ],
          customer: {
            name:
              "Demo Customer",
            email:
              "customer@shopsphere.dev",
            phone:
              "9876543210",
          },
          address: {
            line1:
              "123 Test Street",
            line2: "",
            city:
              "Ludhiana",
            state:
              "Punjab",
            pinCode:
              "141001",
          },
          deliveryMethod: {
            id:
              "standard",
            label:
              "Standard delivery",
            description:
              "Test delivery",
            cost: 0,
            etaMinDays: 4,
            etaMaxDays: 6,
          },
          paymentMethod:
            "mock-card",
          totals: {
            subtotal: 2000,
            discount: 0,
            shipping: 0,
            tax: 100,
            total: 2100,
          },
        };

        localStorage.setItem(
          "shopsphere.auth.session",
          JSON.stringify(
            session,
          ),
        );

        localStorage.setItem(
          "shopsphere-orders",
          JSON.stringify({
            state: {
              orders: [
                order,
              ],
            },
            version: 0,
          }),
        );
      },
      {
        session:
          makeSession(),
      },
    );

    await page.goto(
      "/orders/SS-SHIPPED-TEST",
    );

    await expect(
      page.getByText(
        "Shipped",
        {
          exact: true,
        },
      ).first(),
    ).toBeVisible();

    for (
      const completed of [
        "Order Placed",
        "Confirmed",
        "Packed",
        "Shipped",
      ]
    ) {
      const row =
        page
          .getByRole(
            "listitem",
          )
          .filter({
            hasText:
              completed,
          });

      await expect(
        row,
      ).toBeVisible();

      await expect(
        row.getByText(
          "Upcoming",
          {
            exact: true,
          },
        ),
      ).toHaveCount(0);
    }

    for (
      const upcoming of [
        "Out for Delivery",
        "Delivered",
      ]
    ) {
      const row =
        page
          .getByRole(
            "listitem",
          )
          .filter({
            hasText:
              upcoming,
          });

      await expect(
        row.getByText(
          "Upcoming",
          {
            exact: true,
          },
        ),
      ).toBeVisible();
    }
  },
);
