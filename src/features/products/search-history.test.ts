import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from "./search-history";

describe("search history", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty list when no history exists", () => {
    expect(getRecentSearches()).toEqual([]);
  });

  it("stores a recent search", () => {
    expect(
      addRecentSearch("laptop"),
    ).toEqual(["laptop"]);

    expect(getRecentSearches()).toEqual([
      "laptop",
    ]);
  });

  it("stores searches newest first", () => {
    addRecentSearch("laptop");
    addRecentSearch("phone");
    addRecentSearch("beauty");

    expect(getRecentSearches()).toEqual([
      "beauty",
      "phone",
      "laptop",
    ]);
  });

  it("deduplicates searches case-insensitively", () => {
    addRecentSearch("Laptop");
    addRecentSearch("phone");
    addRecentSearch("laptop");

    expect(getRecentSearches()).toEqual([
      "laptop",
      "phone",
    ]);
  });

  it("trims whitespace before storing", () => {
    addRecentSearch("  laptop  ");

    expect(getRecentSearches()).toEqual([
      "laptop",
    ]);
  });

  it("keeps only the five most recent searches", () => {
    addRecentSearch("one");
    addRecentSearch("two");
    addRecentSearch("three");
    addRecentSearch("four");
    addRecentSearch("five");
    addRecentSearch("six");

    expect(getRecentSearches()).toEqual([
      "six",
      "five",
      "four",
      "three",
      "two",
    ]);
  });

  it("ignores blank searches", () => {
    addRecentSearch("phone");

    expect(
      addRecentSearch("   "),
    ).toEqual(["phone"]);

    expect(getRecentSearches()).toEqual([
      "phone",
    ]);
  });

  it("handles malformed stored data safely", () => {
    window.localStorage.setItem(
      "shopsphere_recent_searches",
      "{invalid-json",
    );

    expect(getRecentSearches()).toEqual([]);
  });

  it("clears recent search history", () => {
    addRecentSearch("laptop");
    addRecentSearch("phone");

    clearRecentSearches();

    expect(getRecentSearches()).toEqual([]);
  });
});
