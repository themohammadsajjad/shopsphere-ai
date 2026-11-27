import type { Metadata } from "next";

import { LazyAdminDashboard } from "@/features/admin/lazy-admin-dashboard";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";

export const metadata: Metadata = {
  title:
    "Admin | ShopSphere AI",
  description:
    "ShopSphere AI administration dashboard.",
};

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AuthenticatedShell
        title="Admin dashboard"
        description="Manage local simulated catalogue and order operations, and monitor recommendation analytics."
      >
        <LazyAdminDashboard />
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
