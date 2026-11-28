import {
  describe,
  expect,
  it,
} from "vitest";

import {
  combineReviews,
  getRatingDistribution,
  sortReviews,
  validateReview,
} from "./review-utils";

describe("review utilities", () => {
  it("rejects short reviews", () => {
    expect(
      validateReview(
        5,
        "Too short",
      ).comment,
    ).toMatch(
      /at least 20/i,
    );
  });

  it("accepts a valid review", () => {
    expect(
      validateReview(
        4,
        "This product works very well for my daily needs.",
      ),
    ).toEqual({});
  });

  it("combines local and API reviews", () => {
    const combined =
      combineReviews(
        [
          {
            rating: 4,
            comment:
              "API review",
            date:
              "2026-01-01T00:00:00.000Z",
            reviewerName:
              "API User",
            reviewerEmail:
              "api@example.com",
          },
        ],
        [
          {
            id: "local-1",
            productId: 1,
            rating: 5,
            comment:
              "Local review",
            createdAt:
              "2026-02-01T00:00:00.000Z",
            reviewerName:
              "Local User",
            reviewerEmail:
              "local@example.com",
            verifiedPurchase:
              true,
            helpful: 0,
            notHelpful: 0,
          },
        ],
        {},
      );

    expect(
      combined,
    ).toHaveLength(2);

    expect(
      combined[0]
        .verifiedPurchase,
    ).toBe(true);
  });

  it("sorts by highest rating", () => {
    const combined =
      combineReviews(
        [
          {
            rating: 3,
            comment: "Three",
            date:
              "2026-01-01T00:00:00.000Z",
            reviewerName:
              "A",
            reviewerEmail:
              "a@example.com",
          },
          {
            rating: 5,
            comment: "Five",
            date:
              "2026-01-02T00:00:00.000Z",
            reviewerName:
              "B",
            reviewerEmail:
              "b@example.com",
          },
        ],
        [],
        {},
      );

    expect(
      sortReviews(
        combined,
        "highest",
      )[0].rating,
    ).toBe(5);
  });

  it("creates five rating distribution rows", () => {
    const combined =
      combineReviews(
        [],
        [],
        {},
      );

    const distribution =
      getRatingDistribution(
        combined,
      );

    expect(
      distribution,
    ).toHaveLength(5);

    expect(
      distribution.map(
        (item) => item.star,
      ),
    ).toEqual([
      5,
      4,
      3,
      2,
      1,
    ]);
  });
});
