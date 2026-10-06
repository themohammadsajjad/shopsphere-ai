"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import type { UserRole } from "@/types/auth";

import { useAuthStore } from "@/store/auth-store";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: UserRole;
};

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);

  const isAuthenticated =
    status === "authenticated" && session !== null;

  const hasRequiredRole =
    !requiredRole || session?.user.role === requiredRole;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(
        `/login?next=${encodeURIComponent(pathname)}`,
      );

      return;
    }

    if (
      isAuthenticated &&
      requiredRole &&
      !hasRequiredRole
    ) {
      router.replace("/dashboard");
    }
  }, [
    hasRequiredRole,
    isAuthenticated,
    pathname,
    requiredRole,
    router,
    status,
  ]);

  if (status === "idle" || status === "loading") {
    return (
      <main className="shopsphere-grid flex min-h-screen items-center justify-center px-6">
        <div
          className="glass-panel rounded-2xl border px-6 py-5 text-sm text-muted-foreground"
          role="status"
        >
          Restoring your session...
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !hasRequiredRole) {
    return (
      <main className="shopsphere-grid flex min-h-screen items-center justify-center px-6">
        <div
          className="glass-panel rounded-2xl border px-6 py-5 text-sm text-muted-foreground"
          role="status"
        >
          Redirecting...
        </div>
      </main>
    );
  }

  return children;
}
