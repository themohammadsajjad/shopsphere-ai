import type { Metadata } from "next";

import { CartView } from "@/features/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart | ShopSphere AI",
  description:
    "Review your ShopSphere AI shopping cart.",
};

export default function CartPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            ShopSphere AI
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Shopping cart
          </h1>

          <p className="mt-3 text-muted-foreground">
            Review quantities,
            discounts, stock, and
            your order total.
          </p>
        </div>

        <CartView />
      </section>
    </main>
  );
}
