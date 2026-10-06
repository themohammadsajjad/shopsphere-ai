import type { Metadata } from "next";

import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";

export const metadata: Metadata = {
  title: "Orders | ShopSphere AI",
  description: "View your ShopSphere AI orders.",
};

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <AuthenticatedShell
        title="Your orders"
        description="Your order history and delivery progress will appear here."
      >
        <section className="glass-panel rounded-3xl border p-6 sm:p-8">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-muted-foreground">
              Order history
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              No orders to show yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Order data, tracking statuses, and history will be connected
              during the orders and checkout implementation phase.
            </p>
          </div>
        </section>
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
