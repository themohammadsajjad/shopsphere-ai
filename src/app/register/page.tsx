import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = {
  title: "Create account | ShopSphere AI",
  description: "Create your ShopSphere AI shopping account.",
};

export default function RegisterPage() {
  return (
    <main className="shopsphere-grid relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="glow-orb pointer-events-none absolute -left-32 bottom-12 h-80 w-80 opacity-40"
        aria-hidden="true"
      />
      <div
        className="glow-orb pointer-events-none absolute -right-28 top-20 h-72 w-72 opacity-50"
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
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in instead
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_auto]">
          <section className="hidden max-w-xl lg:block">
            <p className="mb-4 text-sm font-medium tracking-[0.22em] text-muted-foreground uppercase">
              Built around you
            </p>

            <h2 className="max-w-lg text-5xl font-semibold leading-tight tracking-tight">
              Start shaping a shopping experience that feels personal.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Create an account to unlock your dashboard, saved activity,
              orders, and future personalized recommendations.
            </p>

            <div
              className="depth-scene mt-10 h-64 max-w-lg"
              aria-hidden="true"
            >
              <div className="depth-card glass-panel relative h-full overflow-hidden rounded-[2rem] border p-7">
                <div className="absolute left-7 top-7 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  YOUR SHOPPING PROFILE
                </div>

                <div className="flex h-full items-end gap-4">
                  <div className="h-24 flex-1 rounded-2xl border bg-background/50" />
                  <div className="h-36 flex-1 -translate-y-3 rounded-2xl border bg-background/70" />
                  <div className="h-28 flex-1 rounded-2xl border bg-background/50" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center lg:justify-end">
            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}
