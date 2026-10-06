import type { AuthSession, LocalUserRecord } from "@/types/auth";

import { AUTH_STORAGE_KEYS } from "./constants";
import { createDemoUsers } from "./demo-users";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isLocalUserRecord(value: unknown): value is LocalUserRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    (user.role === "customer" || user.role === "admin") &&
    typeof user.createdAt === "string" &&
    typeof user.passwordHash === "string"
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Record<string, unknown>;
  const user = session.user as Record<string, unknown> | undefined;

  return (
    typeof session.token === "string" &&
    typeof session.expiresAt === "number" &&
    !!user &&
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    (user.role === "customer" || user.role === "admin")
  );
}

export function saveUsers(users: LocalUserRecord[]) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.users, JSON.stringify(users));
}

export async function getUsers(): Promise<LocalUserRecord[]> {
  if (!canUseStorage()) {
    return [];
  }

  const storedUsers = localStorage.getItem(AUTH_STORAGE_KEYS.users);

  if (storedUsers) {
    try {
      const parsed: unknown = JSON.parse(storedUsers);

      if (Array.isArray(parsed)) {
        const validUsers = parsed.filter(isLocalUserRecord);

        if (validUsers.length > 0) {
          return validUsers;
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEYS.users);
    }
  }

  const demoUsers = await createDemoUsers();
  saveUsers(demoUsers);

  return demoUsers;
}

export function saveSession(session: AuthSession) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(
    AUTH_STORAGE_KEYS.session,
    JSON.stringify(session),
  );
}

export function getStoredSession(): AuthSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const storedSession = localStorage.getItem(AUTH_STORAGE_KEYS.session);

  if (!storedSession) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(storedSession);

    if (isAuthSession(parsed)) {
      return parsed;
    }
  } catch {
    // Invalid local data is cleared below.
  }

  clearStoredSession();

  return null;
}

export function clearStoredSession() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEYS.session);
}
