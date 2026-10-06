"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { DEMO_LOGIN_HINTS } from "@/features/auth/demo-users";
import {
  type AuthFieldErrors,
  hasAuthErrors,
  validateLoginInput,
} from "@/features/auth/validation";
import { selectAuthUser, useAuthStore } from "@/store/auth-store";

type LoginFormProps = {
  nextPath?: string | null;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const isLoading = status === "loading";

  function fillDemoAccount(role: "customer" | "admin") {
    const demo = DEMO_LOGIN_HINTS.find((account) => account.role === role);

    if (!demo) {
      return;
    }

    setEmail(demo.email);
    setPassword(demo.password);
    setFieldErrors({});
    clearError();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const errors = validateLoginInput({
      email,
      password,
    });

    setFieldErrors(errors);

    if (hasAuthErrors(errors)) {
      return;
    }

    const success = await login({
      email,
      password,
    });

    if (!success) {
      return;
    }

    const user = selectAuthUser(useAuthStore.getState());

    if (nextPath) {
      router.replace(nextPath);
      return;
    }

    router.replace(user?.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <section className="glass-panel w-full max-w-md rounded-3xl border p-6 shadow-2xl sm:p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          ShopSphere AI
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sign in to continue to your personalized shopping experience.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((current) => ({
                ...current,
                email: undefined,
              }));
            }}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className="h-11 w-full rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
            placeholder="you@example.com"
          />

          {fieldErrors.email ? (
            <p
              id="email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((current) => ({
                ...current,
                password: undefined,
              }));
            }}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            className="h-11 w-full rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
            placeholder="Enter your password"
          />

          {fieldErrors.password ? (
            <p
              id="password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        {authError ? (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {authError.message}
          </div>
        ) : null}

        <Button
          className="h-11 w-full rounded-xl"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">DEMO ACCOUNTS</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => fillDemoAccount("customer")}
          disabled={isLoading}
        >
          Customer demo
        </Button>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => fillDemoAccount("admin")}
          disabled={isLoading}
        >
          Admin demo
        </Button>
      </div>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        New to ShopSphere?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}
