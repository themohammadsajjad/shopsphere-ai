import type {
  ProductReview,
} from "@/types/product";
import type {
  DisplayReview,
  LocalReview,
  ReviewSort,
  ReviewVote,
} from "@/types/review";

export const REVIEW_MIN_LENGTH = 20;
export const REVIEW_MAX_LENGTH = 500;

export function validateReview(
  rating: number,
  comment: string,
) {
  const errors: {
    rating?: string;
    comment?: string;
  } = {};

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    errors.rating =
      "Choose a rating from 1 to 5 stars.";
  }

  const length =
    comment.trim().length;

  if (
    length <
    REVIEW_MIN_LENGTH
  ) {
    errors.comment =
      `Review must be at least ${REVIEW_MIN_LENGTH} characters.`;
  } else if (
    length >
    REVIEW_MAX_LENGTH
  ) {
    errors.comment =
      `Review must be ${REVIEW_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export function combineReviews(
  apiReviews:
    ProductReview[],
  localReviews:
    LocalReview[],
  votes:
    Record<
      string,
      ReviewVote
    >,
): DisplayReview[] {
  const api =
    apiReviews.map(
      (review, index) => {
        const id =
          `api:${review.reviewerEmail}:${review.date}:${index}`;

        const vote =
          votes[id] ?? {
            helpful: 0,
            notHelpful: 0,
          };

        return {
          id,
          rating:
            review.rating,
          comment:
            review.comment,
          date:
            review.date,
          reviewerName:
            review.reviewerName,
          reviewerEmail:
            review.reviewerEmail,
          verifiedPurchase:
            false,
          helpful:
            vote.helpful,
          notHelpful:
            vote.notHelpful,
          local: false,
        };
      },
    );

  const local =
    localReviews.map(
      (review) => {
        const vote =
          votes[
            review.id
          ] ?? {
            helpful: 0,
            notHelpful: 0,
          };

        return {
          id:
            review.id,
          rating:
            review.rating,
          comment:
            review.comment,
          date:
            review.createdAt,
          reviewerName:
            review.reviewerName,
          reviewerEmail:
            review.reviewerEmail,
          verifiedPurchase:
            review.verifiedPurchase,
          helpful:
            review.helpful +
            vote.helpful,
          notHelpful:
            review.notHelpful +
            vote.notHelpful,
          local: true,
        };
      },
    );

  return [
    ...local,
    ...api,
  ];
}

export function sortReviews(
  reviews:
    DisplayReview[],
  sort:
    ReviewSort,
) {
  return [
    ...reviews,
  ].sort((a, b) => {
    if (
      sort ===
      "highest"
    ) {
      return (
        b.rating -
        a.rating
      );
    }

    if (
      sort ===
      "lowest"
    ) {
      return (
        a.rating -
        b.rating
      );
    }

    if (
      sort ===
      "helpful"
    ) {
      return (
        b.helpful -
          a.helpful ||
        Date.parse(
          b.date,
        ) -
          Date.parse(
            a.date,
          )
      );
    }

    return (
      Date.parse(
        b.date,
      ) -
      Date.parse(
        a.date,
      )
    );
  });
}

export function getRatingDistribution(
  reviews:
    DisplayReview[],
) {
  return [
    1,
    2,
    3,
    4,
    5,
  ].map((star) => {
    const count =
      reviews.filter(
        (review) =>
          Math.round(
            review.rating,
          ) === star,
      ).length;

    return {
      star,
      count,
      percentage:
        reviews.length > 0
          ? (count /
              reviews.length) *
            100
          : 0,
    };
  });
}

export function getAverageRating(
  reviews:
    DisplayReview[],
  fallback: number,
) {
  if (
    reviews.length === 0
  ) {
    return fallback;
  }

  return (
    reviews.reduce(
      (sum, review) =>
        sum +
        review.rating,
      0,
    ) /
    reviews.length
  );
}
