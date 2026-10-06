import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ProtectedRoute } from "@/features/auth/protected-route";

export const metadata: Metadata = {
  title: "Dashboard | ShopSphere AI",
  description: "Manage your ShopSphere AI shopping account.",
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AuthenticatedShell
        title="Your dashboard"
        description="Access your account activity and continue your shopping journey."
      >
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article className="glass-panel rounded-3xl border p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Orders
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Track your purchases
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              View your order history and follow order progress.
            </p>

            <Link
              href="/orders"
              className={buttonVariants({
                variant: "outline",
                className: "mt-6 rounded-xl",
              })}
            >
              View orders
            </Link>
          </article>

          <article className="glass-panel rounded-3xl border p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Checkout
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Continue securely
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Access the protected checkout flow when you are ready.
            </p>

            <Link
              href="/checkout"
              className={buttonVariants({
                variant: "outline",
                className: "mt-6 rounded-xl",
              })}
            >
              Go to checkout
            </Link>
          </article>

          <article className="glass-panel rounded-3xl border p-6 md:col-span-2 xl:col-span-1">
            <p className="text-sm font-medium text-muted-foreground">
              Personalization
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Recommendations ahead
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Personalized product recommendations will appear here as
              the recommendation module is completed.
            </p>
          </article>
        </section>
      </AuthenticatedShell>
    </ProtectedRoute>
  );
}
