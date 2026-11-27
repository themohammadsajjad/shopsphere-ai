"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  LocalReview,
  ReviewVote,
} from "@/types/review";

type ReviewState = {
  reviews:
    LocalReview[];
  votes:
    Record<
      string,
      ReviewVote
    >;

  addReview: (
    review:
      LocalReview,
  ) => void;

  updateReview: (
    id: string,
    rating: number,
    comment: string,
  ) => void;

  removeReview: (
    id: string,
  ) => void;

  voteReview: (
    id: string,
    vote:
      "helpful" |
      "notHelpful",
  ) => void;

  clearReviews:
    () => void;
};

export const useReviewStore =
  create<ReviewState>()(
    persist(
      (set) => ({
        reviews: [],
        votes: {},

        addReview:
          (review) =>
            set(
              (state) => ({
                reviews: [
                  review,
                  ...state.reviews,
                ],
              }),
            ),

        updateReview:
          (
            id,
            rating,
            comment,
          ) =>
            set(
              (state) => ({
                reviews:
                  state.reviews.map(
                    (
                      review,
                    ) =>
                      review.id ===
                      id
                        ? {
                            ...review,
                            rating,
                            comment,
                          }
                        : review,
                  ),
              }),
            ),

        removeReview:
          (id) =>
            set(
              (state) => ({
                reviews:
                  state.reviews.filter(
                    (
                      review,
                    ) =>
                      review.id !==
                      id,
                  ),
              }),
            ),

        voteReview:
          (
            id,
            vote,
          ) =>
            set(
              (state) => {
                const current =
                  state.votes[
                    id
                  ] ?? {
                    helpful: 0,
                    notHelpful: 0,
                  };

                return {
                  votes: {
                    ...state.votes,
                    [id]: {
                      ...current,
                      [vote]:
                        current[
                          vote
                        ] + 1,
                    },
                  },
                };
              },
            ),

        clearReviews:
          () =>
            set({
              reviews: [],
              votes: {},
            }),
      }),
      {
        name:
          "shopsphere-reviews",
      },
    ),
  );
