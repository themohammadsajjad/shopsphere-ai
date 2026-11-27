"use client";

import {
  type FormEvent,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import {
  REVIEW_MAX_LENGTH,
  REVIEW_MIN_LENGTH,
  validateReview,
} from "@/features/reviews/review-utils";
import { useAuthStore } from "@/store/auth-store";
import { useReviewStore } from "@/store/review-store";

export function DashboardReviews() {
  const [message, setMessage] =
    useState("");

  const user =
    useAuthStore(
      (state) =>
        state.session?.user ??
        null,
    );

  const reviews =
    useReviewStore(
      (state) =>
        state.reviews,
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

  const hydrated =
    useSyncExternalStore(
      (onChange) =>
        useReviewStore.persist.onFinishHydration(
          onChange,
        ),
      () =>
        useReviewStore.persist.hasHydrated(),
      () => false,
    );

  const userReviews =
    useMemo(
      () =>
        hydrated && user
          ? reviews.filter(
              (review) =>
                review.reviewerEmail.toLowerCase() ===
                user.email.toLowerCase(),
            )
          : [],
      [
        hydrated,
        reviews,
        user,
      ],
    );

  function submit(
    event:
      FormEvent<HTMLFormElement>,
    reviewId: string,
  ) {
    event.preventDefault();

    const data =
      new FormData(
        event.currentTarget,
      );

    const rating =
      Number(
        data.get(
          "rating",
        ),
      );

    const comment =
      String(
        data.get(
          "comment",
        ) ?? "",
      );

    const errors =
      validateReview(
        rating,
        comment,
      );

    if (
      errors.rating ||
      errors.comment
    ) {
      setMessage(
        errors.rating ??
          errors.comment ??
          "Review could not be updated.",
      );

      return;
    }

    updateReview(
      reviewId,
      rating,
      comment.trim(),
    );

    setMessage(
      "Review updated locally.",
    );
  }

  return (
    <article className="glass-panel rounded-3xl border p-6 md:col-span-2 xl:col-span-3">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Reviews
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Your reviews
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Edit or remove reviews you
          submitted on this device.
          Reviews are stored locally
          in this frontend-only build.
        </p>
      </div>

      {message ? (
        <p
          role="status"
          className="mt-4 text-sm"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-5 space-y-4">
        {!hydrated ? (
          <p className="text-sm text-muted-foreground">
            Loading your reviews…
          </p>
        ) : userReviews.length ===
          0 ? (
          <p className="text-sm text-muted-foreground">
            You have not submitted
            any reviews yet.
          </p>
        ) : (
          userReviews.map(
            (review) => (
              <form
                key={
                  review.id
                }
                aria-label={`Review for product ${review.productId}`}
                onSubmit={(
                  event,
                ) =>
                  submit(
                    event,
                    review.id,
                  )
                }
                className="rounded-2xl border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      Product #
                      {
                        review.productId
                      }
                    </p>

                    {review.verifiedPurchase ? (
                      <p className="mt-1 text-xs font-medium">
                        ✓ Verified
                        Purchase
                      </p>
                    ) : null}
                  </div>

                  <Link
                    href={`/products/${review.productId}`}
                    className={buttonVariants({
                      size: "sm",
                      variant:
                        "outline",
                    })}
                  >
                    View product
                  </Link>
                </div>

                <label className="mt-4 block text-sm font-medium">
                  Rating
                  <select
                    name="rating"
                    aria-label={`Rating for product ${review.productId}`}
                    defaultValue={
                      review.rating
                    }
                    className="mt-2 block h-9 rounded-xl border bg-background px-3 font-normal"
                  >
                    {[
                      5,
                      4,
                      3,
                      2,
                      1,
                    ].map(
                      (star) => (
                        <option
                          key={
                            star
                          }
                          value={
                            star
                          }
                        >
                          {star}{" "}
                          stars
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="mt-4 block text-sm font-medium">
                  Review
                  <textarea
                    name="comment"
                    aria-label={`Review text for product ${review.productId}`}
                    minLength={
                      REVIEW_MIN_LENGTH
                    }
                    maxLength={
                      REVIEW_MAX_LENGTH
                    }
                    defaultValue={
                      review.comment
                    }
                    className="mt-2 min-h-24 w-full rounded-xl border bg-background p-3 font-normal"
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    size="sm"
                  >
                    Update review
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      removeReview(
                        review.id,
                      );

                      setMessage(
                        "Review removed locally.",
                      );
                    }}
                  >
                    Remove review
                  </Button>
                </div>
              </form>
            ),
          )
        )}
      </div>
    </article>
  );
}
