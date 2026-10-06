import { beforeEach, describe, expect, it } from "vitest";

import type { AuthSession } from "@/types/auth";

import {
  AuthServiceError,
  login,
  logout,
  register,
  restoreSession,
} from "./auth-service";
import { saveSession } from "@/features/auth/storage";

describe("auth service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("logs in the demo customer and creates a token-like session", async () => {
    const session = await login({
      email: "customer@shopsphere.dev",
      password: "Customer123!",
    });

    expect(session.user.role).toBe("customer");
    expect(session.user.email).toBe("customer@shopsphere.dev");
    expect(session.token.split(".")).toHaveLength(3);
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });

  it("logs in the demo administrator with the admin role", async () => {
    const session = await login({
      email: "admin@shopsphere.dev",
      password: "Admin123!",
    });

    expect(session.user.role).toBe("admin");
  });

  it("rejects invalid credentials", async () => {
    await expect(
      login({
        email: "customer@shopsphere.dev",
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
      message: "Email or password is incorrect.",
    });
  });

  it("registers a new customer and persists the session", async () => {
    const session = await register({
      name: "New Shopper",
      email: "newshopper@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(session.user.name).toBe("New Shopper");
    expect(session.user.email).toBe("newshopper@example.com");
    expect(session.user.role).toBe("customer");

    expect(restoreSession()).toEqual(session);
  });

  it("rejects registration when the email already exists", async () => {
    await expect(
      register({
        name: "Duplicate User",
        email: "CUSTOMER@SHOPSPHERE.DEV",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).rejects.toMatchObject({
      code: "EMAIL_ALREADY_EXISTS",
    });
  });

  it("clears the session on logout", async () => {
    await login({
      email: "customer@shopsphere.dev",
      password: "Customer123!",
    });

    logout();

    expect(restoreSession()).toBeNull();
  });

  it("clears an expired session instead of restoring it", () => {
    const expiredSession: AuthSession = {
      token: "expired.mock.token",
      expiresAt: Date.now() - 1,
      user: {
        id: "expired-user",
        name: "Expired User",
        email: "expired@example.com",
        role: "customer",
        createdAt: new Date(0).toISOString(),
      },
    };

    saveSession(expiredSession);

    expect(restoreSession()).toBeNull();
  });

  it("returns a structured auth error for invalid input", async () => {
    try {
      await login({
        email: "invalid-email",
        password: "",
      });

      throw new Error("Expected login to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(AuthServiceError);
      expect(error).toMatchObject({
        code: "INVALID_INPUT",
      });
    }
  });
});
