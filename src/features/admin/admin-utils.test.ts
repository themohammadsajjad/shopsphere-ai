import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createLocalProduct,
  mergeAdminProducts,
} from "./admin-utils";

describe("admin catalogue utilities", () => {
  it("creates a local simulated product", () => {
    const product =
      createLocalProduct({
        title:
          "Local Product",
        category:
          "Test Category",
        price: 999,
        stock: 5,
      });

    expect(
      product.category,
    ).toBe(
      "test-category",
    );

    expect(
      product.brand,
    ).toBe(
      "Local Simulation",
    );
  });

  it("overrides base products", () => {
    const base =
      createLocalProduct({
        title: "Base",
        category: "test",
        price: 100,
        stock: 1,
      });

    const updated = {
      ...base,
      title: "Updated",
    };

    expect(
      mergeAdminProducts(
        [base],
        [updated],
        [],
      )[0].title,
    ).toBe("Updated");
  });

  it("removes locally deleted products", () => {
    const product =
      createLocalProduct({
        title: "Delete",
        category: "test",
        price: 100,
        stock: 1,
      });

    expect(
      mergeAdminProducts(
        [product],
        [],
        [product.id],
      ),
    ).toEqual([]);
  });
});
