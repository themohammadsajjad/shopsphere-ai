import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | ShopSphere AI",
  description: "Sign in to your ShopSphere AI account.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function getSafeNextPath(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);

  return (
    <main className="shopsphere-grid relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="glow-orb pointer-events-none absolute -left-28 top-20 h-72 w-72 opacity-50"
        aria-hidden="true"
      />
      <div
        className="glow-orb pointer-events-none absolute -right-32 bottom-10 h-80 w-80 opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
          >
            ShopSphere AI
          </Link>

          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_auto]">
          <section className="hidden max-w-xl lg:block">
            <p className="mb-4 text-sm font-medium tracking-[0.22em] text-muted-foreground uppercase">
              Personalized commerce
            </p>

            <h2 className="max-w-lg text-5xl font-semibold leading-tight tracking-tight">
              Your store gets smarter every time you return.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Sign in to access your dashboard, orders, wishlist, and
              personalized shopping experience.
            </p>

            <div
              className="depth-scene mt-10 h-64 max-w-lg"
              aria-hidden="true"
            >
              <div className="depth-card glass-panel relative h-full overflow-hidden rounded-[2rem] border p-7">
                <div className="absolute right-7 top-7 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  AI PERSONALIZED
                </div>

                <div className="flex h-full flex-col justify-end">
                  <div className="mb-5 grid grid-cols-3 gap-3">
                    <div className="h-20 rounded-2xl border bg-background/50" />
                    <div className="h-28 -translate-y-4 rounded-2xl border bg-background/70" />
                    <div className="h-20 rounded-2xl border bg-background/50" />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Discover products shaped around your preferences.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center lg:justify-end">
            <LoginForm nextPath={nextPath} />
          </div>
        </div>
      </div>
    </main>
  );
}
