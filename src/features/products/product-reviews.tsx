"use client";

import {
  type FormEvent,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { Button } from "@/components/ui/button";
import {
  getAverageRating,
  getRatingDistribution,
  combineReviews,
  REVIEW_MAX_LENGTH,
  REVIEW_MIN_LENGTH,
  sortReviews,
  validateReview,
} from "@/features/reviews/review-utils";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import { useReviewStore } from "@/store/review-store";
import type {
  ProductReview,
} from "@/types/product";
import type {
  ReviewSort,
} from "@/types/review";

type ProductReviewsProps = {
  productId: number;
  productTitle: string;
  rating: number;
  reviews:
    ProductReview[];
};

export function ProductReviews({
  productId,
  productTitle,
  rating,
  reviews,
}: ProductReviewsProps) {
  const [sort, setSort] =
    useState<ReviewSort>(
      "recent",
    );

  const [reviewRating, setReviewRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [errors, setErrors] =
    useState<{
      rating?: string;
      comment?: string;
    }>({});

  const user =
    useAuthStore(
      (state) =>
        state.session?.user ??
        null,
    );

  const orders =
    useOrderStore(
      (state) =>
        state.orders,
    );

  const localReviews =
    useReviewStore(
      (state) =>
        state.reviews,
    );

  const votes =
    useReviewStore(
      (state) =>
        state.votes,
    );

  const addReview =
    useReviewStore(
      (state) =>
        state.addReview,
    );

  const updateReview =
    useReviewStore(
      (state) =>
        state.updateReview,
    );

  const removeReview =
    useReviewStore(
      (state) =>
        state.removeReview,
    );

  const voteReview =
    useReviewStore(
      (state) =>
        state.voteReview,
    );

  const hasHydrated =
    useSyncExternalStore(
      (onChange) =>
        useReviewStore.persist.onFinishHydration(
          onChange,
        ),
      () =>
        useReviewStore.persist.hasHydrated(),
      () => false,
    );

  const productLocalReviews =
    useMemo(
      () =>
        hasHydrated
          ? localReviews.filter(
              (review) =>
                review.productId ===
                productId,
            )
          : [],
      [
        hasHydrated,
        localReviews,
        productId,
      ],
    );

  const combined =
    useMemo(
      () =>
        combineReviews(
          reviews,
          productLocalReviews,
          hasHydrated
            ? votes
            : {},
        ),
      [
        hasHydrated,
        productLocalReviews,
        reviews,
        votes,
      ],
    );

  const sorted =
    useMemo(
      () =>
        sortReviews(
          combined,
          sort,
        ),
      [combined, sort],
    );

  const distribution =
    getRatingDistribution(
      combined,
    );

  const average =
    getAverageRating(
      combined,
      rating,
    );

  const userReview =
    user
      ? productLocalReviews.find(
          (review) =>
            review.reviewerEmail.toLowerCase() ===
            user.email.toLowerCase(),
        )
      : undefined;

  const verifiedPurchase =
    Boolean(
      user &&
        orders.some(
          (order) =>
            order.customer.email.toLowerCase() ===
              user.email.toLowerCase() &&
            order.items.some(
              (item) =>
                item.productId ===
                productId,
            ),
        ),
    );

  function submit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const nextErrors =
      validateReview(
        reviewRating,
        comment,
      );

    setErrors(
      nextErrors,
    );

    if (
      nextErrors.rating ||
      nextErrors.comment
    ) {
      return;
    }

    if (userReview) {
      updateReview(
        userReview.id,
        reviewRating,
        comment.trim(),
      );
    } else {
      addReview({
        id:
          crypto.randomUUID(),
        productId,
        rating:
          reviewRating,
        comment:
          comment.trim(),
        createdAt:
          new Date().toISOString(),
        reviewerName:
          user.name,
        reviewerEmail:
          user.email,
        verifiedPurchase,
        helpful: 0,
        notHelpful: 0,
      });
    }

    setComment("");
    setReviewRating(5);
    setErrors({});
  }

  return (
    <section className="glass-panel rounded-3xl border p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Customer reviews
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Reviews for{" "}
            <span className="font-medium text-foreground">
              {productTitle}
            </span>
            . Verified Purchase is
            derived from local
            ShopSphere order history.
          </p>
        </div>

        <label className="text-sm">
          <span className="sr-only">
            Sort reviews
          </span>

          <select
            aria-label="Sort reviews"
            value={sort}
            onChange={(
              event,
            ) =>
              setSort(
                event.target
                  .value as
                  ReviewSort,
              )
            }
            className="h-9 rounded-xl border bg-background px-3"
          >
            <option value="recent">
              Most recent
            </option>
            <option value="highest">
              Highest rated
            </option>
            <option value="lowest">
              Lowest rated
            </option>
            <option value="helpful">
              Most helpful
            </option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <p className="text-4xl font-semibold">
            {average.toFixed(
              1,
            )}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            ★★★★★ ·{" "}
            {combined.length}{" "}
            {combined.length ===
            1
              ? "review"
              : "reviews"}
          </p>

          <div
            aria-label="Rating distribution"
            className="mt-5 space-y-2"
          >
            {distribution.map(
              ({
                star,
                count,
                percentage,
              }) => (
                <div
                  key={star}
                  className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-xs"
                >
                  <span>
                    {star}★
                  </span>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-foreground"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-muted-foreground">
                    {count}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="space-y-6">
          {user ? (
            <form
              onSubmit={submit}
              className="rounded-2xl border p-4"
            >
              <h3 className="font-semibold">
                {userReview
                  ? "Update your review"
                  : "Write a review"}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Review text must
                contain{" "}
                {REVIEW_MIN_LENGTH}–
                {REVIEW_MAX_LENGTH}{" "}
                characters.
              </p>

              {verifiedPurchase ? (
                <p className="mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-medium">
                  ✓ Verified Purchase
                </p>
              ) : null}

              <fieldset className="mt-4">
                <legend className="text-sm font-medium">
                  Rating
                </legend>

                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                  ].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`${star} stars`}
                        aria-pressed={
                          reviewRating ===
                          star
                        }
                        onClick={() =>
                          setReviewRating(
                            star,
                          )
                        }
                        className={`rounded-lg border px-3 py-2 ${
                          reviewRating ===
                          star
                            ? "bg-foreground text-background"
                            : ""
                        }`}
                      >
                        {star}★
                      </button>
                    ),
                  )}
                </div>

                {errors.rating ? (
                  <p
                    role="alert"
                    className="mt-2 text-xs text-destructive"
                  >
                    {
                      errors.rating
                    }
                  </p>
                ) : null}
              </fieldset>

              <label className="mt-4 block text-sm font-medium">
                Review
                <textarea
                  aria-label="Review"
                  value={comment}
                  maxLength={
                    REVIEW_MAX_LENGTH
                  }
                  onChange={(
                    event,
                  ) =>
                    setComment(
                      event.target
                        .value,
                    )
                  }
                  className="mt-2 min-h-28 w-full rounded-xl border bg-background p-3 font-normal"
                  placeholder="Share what you liked or what could be better."
                />
              </label>

              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>
                  {comment.length}/
                  {
                    REVIEW_MAX_LENGTH
                  }
                </span>
              </div>

              {errors.comment ? (
                <p
                  role="alert"
                  className="mt-2 text-xs text-destructive"
                >
                  {
                    errors.comment
                  }
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="submit">
                  {userReview
                    ? "Update review"
                    : "Submit review"}
                </Button>

                {userReview ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      removeReview(
                        userReview.id,
                      )
                    }
                  >
                    Remove review
                  </Button>
                ) : null}
              </div>
            </form>
          ) : (
            <p className="rounded-2xl border p-4 text-sm text-muted-foreground">
              Sign in to submit a
              review. Existing
              reviews remain
              available to browse.
            </p>
          )}

          <div className="space-y-4">
            {sorted.length ===
            0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews yet. Be
                the first to share
                feedback.
              </p>
            ) : (
              sorted.map(
                (review) => (
                  <article
                    key={
                      review.id
                    }
                    className="rounded-2xl border p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {
                            review.reviewerName
                          }
                        </p>

                        <p className="mt-1 text-sm">
                          {"★".repeat(
                            Math.round(
                              review.rating,
                            ),
                          )}
                        </p>

                        {review.verifiedPurchase ? (
                          <p className="mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-medium">
                            ✓ Verified Purchase
                          </p>
                        ) : null}
                      </div>

                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={
                          review.date
                        }
                      >
                        {new Date(
                          review.date,
                        ).toLocaleDateString(
                          "en-IN",
                        )}
                      </time>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {
                        review.comment
                      }
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          voteReview(
                            review.id,
                            "helpful",
                          )
                        }
                      >
                        Helpful (
                        {
                          review.helpful
                        }
                        )
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          voteReview(
                            review.id,
                            "notHelpful",
                          )
                        }
                      >
                        Not Helpful (
                        {
                          review.notHelpful
                        }
                        )
                      </Button>
                    </div>
                  </article>
                ),
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
