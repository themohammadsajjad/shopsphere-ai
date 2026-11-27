import type { Metadata } from "next";

import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { OrdersView } from "@/features/orders/orders-view";

export const metadata: Metadata = {
  title:
    "Orders | ShopSphere AI",
  description:
    "View your ShopSphere AI order history.",
};

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <AuthenticatedShell
        title="Your orders"
        description="Review your simulated order history and delivery progress."
      >
        <OrdersView />
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
