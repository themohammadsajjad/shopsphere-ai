import type { Metadata } from "next";

import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { OrderDetail } from "@/features/orders/order-detail";

export const metadata: Metadata = {
  title:
    "Order Tracking | ShopSphere AI",
};

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({
  params,
}: OrderPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <AuthenticatedShell
        title="Order tracking"
        description="Track each simulated fulfilment stage from placement through delivery."
      >
        <OrderDetail
          orderId={id}
        />
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
