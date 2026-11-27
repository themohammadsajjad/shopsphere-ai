import type { Metadata } from "next";

import { CheckoutFlow } from "@/features/checkout/checkout-flow";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";

export const metadata: Metadata = {
  title:
    "Checkout | ShopSphere AI",
  description:
    "Complete the simulated ShopSphere AI checkout flow.",
};

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <AuthenticatedShell
        title="Checkout"
        description="Complete the six-step simulated checkout. No real payment credentials are collected."
      >
        <CheckoutFlow />
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
