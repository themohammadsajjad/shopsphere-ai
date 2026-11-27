import type { Metadata } from "next";

import { WishlistView } from "@/features/wishlist/wishlist-view";

export const metadata: Metadata = {
  title:
    "Wishlist | ShopSphere AI",
  description:
    "Manage saved ShopSphere AI products.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            ShopSphere AI
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Your wishlist
          </h1>

          <p className="mt-3 text-muted-foreground">
            Saved products with
            current pricing and
            availability.
          </p>
        </div>

        <WishlistView />
      </section>
    </main>
  );
}
