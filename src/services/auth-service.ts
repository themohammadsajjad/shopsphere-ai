import type {
  AuthErrorCode,
  AuthSession,
  AuthUser,
  LocalUserRecord,
  LoginCredentials,
  RegisterInput,
} from "@/types/auth";

import { AUTH_SESSION_DURATION_MS } from "@/features/auth/constants";
import {
  hashMockPassword,
  verifyMockPassword,
} from "@/features/auth/credentials";
import {
  clearStoredSession,
  getStoredSession,
  getUsers,
  saveSession,
  saveUsers,
} from "@/features/auth/storage";
import {
  normalizeEmail,
  validateLoginInput,
  validateRegisterInput,
  hasAuthErrors,
} from "@/features/auth/validation";

export class AuthServiceError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
  }
}

function toAuthUser(user: LocalUserRecord): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

function encodeTokenPart(value: object) {
  const json = JSON.stringify(value);

  return btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createMockToken(user: AuthUser, expiresAt: number) {
  const header = encodeTokenPart({
    alg: "MOCK",
    typ: "JWT",
  });

  const payload = encodeTokenPart({
    sub: user.id,
    role: user.role,
    exp: Math.floor(expiresAt / 1000),
  });

  const signature = crypto.randomUUID().replaceAll("-", "");

  return `${header}.${payload}.${signature}`;
}

function createSession(user: AuthUser): AuthSession {
  const expiresAt = Date.now() + AUTH_SESSION_DURATION_MS;

  return {
    token: createMockToken(user, expiresAt),
    user,
    expiresAt,
  };
}

export async function register(
  input: RegisterInput,
): Promise<AuthSession> {
  const validationErrors = validateRegisterInput(input);

  if (hasAuthErrors(validationErrors)) {
    throw new AuthServiceError(
      "INVALID_INPUT",
      "Please correct the highlighted registration fields.",
    );
  }

  const users = await getUsers();
  const email = normalizeEmail(input.email);

  const emailExists = users.some(
    (user) => normalizeEmail(user.email) === email,
  );

  if (emailExists) {
    throw new AuthServiceError(
      "EMAIL_ALREADY_EXISTS",
      "An account with this email already exists.",
    );
  }

  const newUser: LocalUserRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    role: "customer",
    createdAt: new Date().toISOString(),
    passwordHash: await hashMockPassword(input.password),
  };

  saveUsers([...users, newUser]);

  const session = createSession(toAuthUser(newUser));
  saveSession(session);

  return session;
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const validationErrors = validateLoginInput(credentials);

  if (hasAuthErrors(validationErrors)) {
    throw new AuthServiceError(
      "INVALID_INPUT",
      "Enter a valid email and password.",
    );
  }

  const users = await getUsers();
  const email = normalizeEmail(credentials.email);

  const user = users.find(
    (candidate) => normalizeEmail(candidate.email) === email,
  );

  if (!user) {
    throw new AuthServiceError(
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
    );
  }

  const passwordMatches = await verifyMockPassword(
    credentials.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AuthServiceError(
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
    );
  }

  const session = createSession(toAuthUser(user));
  saveSession(session);

  return session;
}

export function logout() {
  clearStoredSession();
}

export function restoreSession(): AuthSession | null {
  const session = getStoredSession();

  if (!session) {
    return null;
  }

  if (session.expiresAt <= Date.now()) {
    clearStoredSession();

    return null;
  }

  return session;
}

export function isSessionExpired(session: AuthSession) {
  return session.expiresAt <= Date.now();
}
