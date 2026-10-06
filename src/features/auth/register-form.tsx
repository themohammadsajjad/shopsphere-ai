"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  type AuthFieldErrors,
  hasAuthErrors,
  validateRegisterInput,
} from "@/features/auth/validation";
import { useAuthStore } from "@/store/auth-store";

export function RegisterForm() {
  const router = useRouter();

  const register = useAuthStore((state) => state.register);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const isLoading = status === "loading";

  function clearFieldError(field: keyof AuthFieldErrors) {
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    clearError();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const input = {
      name,
      email,
      password,
      confirmPassword,
    };

    const errors = validateRegisterInput(input);

    setFieldErrors(errors);

    if (hasAuthErrors(errors)) {
      return;
    }

    const success = await register(input);

    if (!success) {
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <section className="glass-panel w-full max-w-md rounded-3xl border p-6 shadow-2xl sm:p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          ShopSphere AI
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Set up your profile to start building a personalized shopping
          experience.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearFieldError("name");
            }}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className="h-11 w-full rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
            placeholder="Your name"
          />

          {fieldErrors.name ? (
            <p
              id="name-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

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
              clearFieldError("email");
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearFieldError("password");
            }}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password
                ? "password-error"
                : "password-help"
            }
            className="h-11 w-full rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
            placeholder="Minimum 8 characters"
          />

          {fieldErrors.password ? (
            <p
              id="password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {fieldErrors.password}
            </p>
          ) : (
            <p
              id="password-help"
              className="text-xs text-muted-foreground"
            >
              Use at least 8 characters.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="confirmPassword">
            Confirm password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              clearFieldError("confirmPassword");
            }}
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={
              fieldErrors.confirmPassword
                ? "confirm-password-error"
                : undefined
            }
            className="h-11 w-full rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
            placeholder="Re-enter your password"
          />

          {fieldErrors.confirmPassword ? (
            <p
              id="confirm-password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {fieldErrors.confirmPassword}
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
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
