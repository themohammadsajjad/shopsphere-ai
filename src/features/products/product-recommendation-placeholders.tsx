const rails = [
  "Related Products",
  "Similar Products",
  "Frequently Bought Together",
  "Recommended For You",
];

export function ProductRecommendationPlaceholders() {
  return (
    <div className="space-y-8">
      {rails.map((rail) => (
        <section
          key={rail}
          aria-label={rail}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {rail}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Personalized product
              suggestions will appear
              here as recommendation
              signals become
              available.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="glass-panel overflow-hidden rounded-2xl border"
              >
                <div className="aspect-square animate-pulse bg-muted/50" />

                <div className="space-y-2 p-3">
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
