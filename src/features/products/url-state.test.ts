import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProductDiscoveryParams,
  parseProductDiscoveryState,
} from "./url-state";

describe("parseProductDiscoveryState", () => {
  it("parses search, sorting, and page values", () => {
    const params = new URLSearchParams(
      "q=phone&sortBy=price&order=desc&page=3",
    );

    expect(
      parseProductDiscoveryState(params),
    ).toEqual({
      search: "phone",
      category: undefined,
      sortBy: "price",
      order: "desc",
      page: 3,
    });
  });

  it("parses a category when no search is present", () => {
    const params = new URLSearchParams(
      "category=beauty",
    );

    expect(
      parseProductDiscoveryState(params),
    ).toEqual({
      search: undefined,
      category: "beauty",
      sortBy: undefined,
      order: undefined,
      page: 1,
    });
  });

  it("gives search priority over category", () => {
    const params = new URLSearchParams(
      "q=laptop&category=beauty",
    );

    const state =
      parseProductDiscoveryState(params);

    expect(state.search).toBe("laptop");
    expect(state.category).toBeUndefined();
  });

  it("uses ascending order when sortBy is valid but order is missing", () => {
    const params = new URLSearchParams(
      "sortBy=title",
    );

    const state =
      parseProductDiscoveryState(params);

    expect(state.sortBy).toBe("title");
    expect(state.order).toBe("asc");
  });

  it("ignores invalid sorting values", () => {
    const params = new URLSearchParams(
      "sortBy=unknown&order=desc",
    );

    const state =
      parseProductDiscoveryState(params);

    expect(state.sortBy).toBeUndefined();
    expect(state.order).toBeUndefined();
  });

  it.each([
    ["0", 1],
    ["-2", 1],
    ["abc", 1],
    ["2abc", 1],
    ["2.5", 1],
    ["4", 4],
  ])(
    "parses page %s as %i",
    (pageValue, expectedPage) => {
      const params = new URLSearchParams({
        page: pageValue,
      });

      expect(
        parseProductDiscoveryState(params).page,
      ).toBe(expectedPage);
    },
  );
});

describe("createProductDiscoveryParams", () => {
  it("creates search, sorting, and page parameters", () => {
    const params =
      createProductDiscoveryParams({
        search: " phone ",
        category: undefined,
        sortBy: "price",
        order: "desc",
        page: 2,
      });

    expect(params.get("q")).toBe("phone");
    expect(params.get("sortBy")).toBe(
      "price",
    );
    expect(params.get("order")).toBe(
      "desc",
    );
    expect(params.get("page")).toBe("2");
  });

  it("creates a category parameter when search is empty", () => {
    const params =
      createProductDiscoveryParams({
        search: undefined,
        category: "beauty",
        sortBy: undefined,
        order: undefined,
        page: 1,
      });

    expect(params.toString()).toBe(
      "category=beauty",
    );
  });

  it("gives search priority over category", () => {
    const params =
      createProductDiscoveryParams({
        search: "laptop",
        category: "beauty",
        sortBy: undefined,
        order: undefined,
        page: 1,
      });

    expect(params.get("q")).toBe("laptop");
    expect(
      params.has("category"),
    ).toBe(false);
  });

  it("omits page when the current page is one", () => {
    const params =
      createProductDiscoveryParams({
        search: undefined,
        category: undefined,
        sortBy: undefined,
        order: undefined,
        page: 1,
      });

    expect(params.has("page")).toBe(false);
  });

  it("defaults sort order to ascending when missing", () => {
    const params =
      createProductDiscoveryParams({
        search: undefined,
        category: undefined,
        sortBy: "rating",
        order: undefined,
        page: 1,
      });

    expect(params.get("sortBy")).toBe(
      "rating",
    );
    expect(params.get("order")).toBe(
      "asc",
    );
  });
});
