import { beforeEach, describe, expect, it } from "vitest";

import type { AuthSession, LocalUserRecord } from "@/types/auth";

import { AUTH_STORAGE_KEYS } from "./constants";
import {
  clearStoredSession,
  getStoredSession,
  getUsers,
  saveSession,
  saveUsers,
} from "./storage";

describe("auth storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds demo users when no users are stored", async () => {
    const users = await getUsers();

    expect(users).toHaveLength(2);
    expect(users.map((user) => user.role)).toEqual([
      "customer",
      "admin",
    ]);

    expect(localStorage.getItem(AUTH_STORAGE_KEYS.users)).not.toBeNull();
  });

  it("stores and restores local users", async () => {
    const users: LocalUserRecord[] = [
      {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "customer",
        createdAt: new Date(0).toISOString(),
        passwordHash: "hashed-password",
      },
    ];

    saveUsers(users);

    await expect(getUsers()).resolves.toEqual(users);
  });

  it("stores and restores an auth session", () => {
    const session: AuthSession = {
      token: "mock-token",
      expiresAt: Date.now() + 60_000,
      user: {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "customer",
        createdAt: new Date(0).toISOString(),
      },
    };

    saveSession(session);

    expect(getStoredSession()).toEqual(session);
  });

  it("clears a stored session", () => {
    const session: AuthSession = {
      token: "mock-token",
      expiresAt: Date.now() + 60_000,
      user: {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "customer",
        createdAt: new Date(0).toISOString(),
      },
    };

    saveSession(session);
    clearStoredSession();

    expect(getStoredSession()).toBeNull();
  });

  it("recovers safely from malformed session data", () => {
    localStorage.setItem(AUTH_STORAGE_KEYS.session, "{broken-json");

    expect(getStoredSession()).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEYS.session)).toBeNull();
  });
});
