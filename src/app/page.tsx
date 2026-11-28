import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { FeaturedProducts } from "@/features/home/featured-products";
import { HomeHeader } from "@/features/home/home-header";
import { HomeRecommendations } from "@/features/recommendations/home-recommendations";

const categories = [
  {
    label: "Beauty",
    slug: "beauty",
  },
  {
    label: "Shoes",
    slug: "mens-shoes",
  },
  {
    label: "Smartphones",
    slug: "smartphones",
  },
  {
    label: "Laptops",
    slug: "laptops",
  },
];

export default function Home() {
  return (
    <main className="shopsphere-grid min-h-screen">
      <HomeHeader />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Personalized
              shopping, powered by
              intelligence
            </p>

            <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Find products that
              make sense for{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
                you
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Browse a multi-category
              storefront with
              explainable
              recommendations shaped
              by what you view, save,
              search, and buy.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className={buttonVariants({
                  size: "lg",
                })}
              >
                Shop products
              </Link>

              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: "lg",
                  variant:
                    "outline",
                })}
              >
                View personalization
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] border p-6 sm:p-8">
            <p className="text-sm font-medium text-muted-foreground">
              How recommendations
              work
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Transparent signals,
              not random products
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Recent views",
                  href: "#recommendations-recently-viewed",
                },
                {
                  label: "Search history",
                  href: "/dashboard#recommendation-preferences",
                },
                {
                  label: "Price range",
                  href: "#recommendations-price-based",
                },
                {
                  label: "Wishlist",
                  href: "/wishlist",
                },
                {
                  label: "Cart",
                  href: "/cart",
                },
                {
                  label: "Order history",
                  href: "/orders",
                },
              ].map(
                (signal) => (
                  <Link
                    key={signal.label}
                    href={signal.href}
                    className="group flex items-center justify-between rounded-2xl border bg-background/60 p-4 text-sm font-medium transition hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>
                      {signal.label}
                    </span>

                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>

        <nav
          aria-label="Categories"
          className="mb-12 flex flex-wrap gap-2 border-y py-5"
        >
          {categories.map(
            (category) => (
              <Link
                key={
                  category.slug
                }
                href={`/products?category=${category.slug}`}
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                {
                  category.label
                }
              </Link>
            ),
          )}
        </nav>

        <FeaturedProducts />
        <HomeRecommendations />
      </div>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p className="font-medium text-foreground">
            ShopSphere AI
          </p>
          <p>
            Frontend-only simulated
            commerce and explainable
            personalization.
          </p>
        </div>
      </footer>
    </main>
  );
}
