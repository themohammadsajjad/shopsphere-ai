import type { Metadata } from "next";

import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";

export const metadata: Metadata = {
  title: "Checkout | ShopSphere AI",
  description: "Continue to the protected ShopSphere AI checkout.",
};

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <AuthenticatedShell
        title="Checkout"
        description="Checkout is protected so only signed-in customers can continue."
      >
        <section className="glass-panel rounded-3xl border p-6 sm:p-8">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-muted-foreground">
              Protected checkout
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Your checkout flow starts here
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Shipping, delivery, review, and mock payment steps will be
              implemented during the checkout module.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">
                Step 1
              </p>
              <p className="mt-1 text-sm font-medium">
                Shipping
              </p>
            </div>

            <div className="rounded-2xl border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">
                Step 2
              </p>
              <p className="mt-1 text-sm font-medium">
                Review
              </p>
            </div>

            <div className="rounded-2xl border bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">
                Step 3
              </p>
              <p className="mt-1 text-sm font-medium">
                Mock payment
              </p>
            </div>
          </div>
        </section>
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
