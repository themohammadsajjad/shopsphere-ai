import type { Metadata } from "next";

import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";

export const metadata: Metadata = {
  title: "Admin | ShopSphere AI",
  description: "ShopSphere AI administration dashboard.",
};

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AuthenticatedShell
        title="Admin dashboard"
        description="Manage simulated commerce data and monitor the ShopSphere AI storefront."
      >
        <section className="grid gap-5 md:grid-cols-3">
          <article className="glass-panel rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">
              Products
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Product management
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Local product management tools will be added during the
              admin module.
            </p>
          </article>

          <article className="glass-panel rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">
              Orders
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Order operations
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Simulated order administration will appear here later.
            </p>
          </article>

          <article className="glass-panel rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">
              Analytics
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Store insights
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Local analytics fixtures will power this area in the admin
              implementation phase.
            </p>
          </article>
        </section>
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
