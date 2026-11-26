import {
  describe,
  expect,
  it,
} from "vitest";

import {
  convertUsdToInr,
  formatInr,
} from "./currency";

describe("currency utilities", () => {
  it("converts USD catalog prices to INR", () => {
    expect(
      convertUsdToInr(10),
    ).toBe(830);
  });

  it("formats Indian rupees", () => {
    expect(
      formatInr(3200),
    ).toContain("₹3,200");
  });
});
