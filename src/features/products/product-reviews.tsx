import type {
  ProductReview,
} from "@/types/product";

type ProductReviewsProps = {
  rating: number;
  reviews: ProductReview[];
};

export function ProductReviews({
  rating,
  reviews,
}: ProductReviewsProps) {
  const distribution = [
    5,
    4,
    3,
    2,
    1,
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

  return (
    <section className="glass-panel rounded-3xl border p-5 sm:p-7">
      <h2 className="text-2xl font-semibold">
        Customer reviews
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <p className="text-4xl font-semibold">
            {rating.toFixed(1)}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            ★★★★★ ·{" "}
            {reviews.length}{" "}
            {reviews.length === 1
              ? "review"
              : "reviews"}
          </p>

          <div className="mt-5 space-y-2">
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

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            reviews.map(
              (review, index) => (
                <article
                  key={`${review.reviewerEmail}-${review.date}-${index}`}
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
                </article>
              ),
            )
          )}
        </div>
      </div>
    </section>
  );
}
