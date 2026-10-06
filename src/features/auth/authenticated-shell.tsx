"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { ReactNode } from "react";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import {
  selectAuthUser,
  selectIsAdmin,
  useAuthStore,
} from "@/store/auth-store";

type AuthenticatedShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthenticatedShell({
  title,
  description,
  children,
}: AuthenticatedShellProps) {
  const router = useRouter();

  const user = useAuthStore(selectAuthUser);
  const isAdmin = useAuthStore(selectIsAdmin);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <main className="shopsphere-grid min-h-screen">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mr-auto text-lg font-semibold tracking-tight"
          >
            ShopSphere AI
          </Link>

          <nav
            className="flex flex-wrap items-center gap-1"
            aria-label="Account navigation"
          >
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Dashboard
            </Link>

            <Link
              href="/orders"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Orders
            </Link>

            <Link
              href="/checkout"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Checkout
            </Link>

            {isAdmin ? (
              <Link
                href="/admin"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Admin
              </Link>
            ) : null}
          </nav>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Signed in as {user?.name ?? "ShopSphere user"}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            {title}
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}
