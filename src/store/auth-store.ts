import { create } from "zustand";

import type {
  AuthError,
  AuthSession,
  AuthStatus,
  AuthUser,
  LoginCredentials,
  RegisterInput,
} from "@/types/auth";

import {
  AuthServiceError,
  login as loginWithService,
  logout as logoutWithService,
  register as registerWithService,
  restoreSession,
} from "@/services/auth-service";

type AuthState = {
  session: AuthSession | null;
  status: AuthStatus;
  error: AuthError | null;
  hydrate: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};

function getAuthError(error: unknown): AuthError {
  if (error instanceof AuthServiceError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN",
    message: "Something went wrong. Please try again.",
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  status: "idle",
  error: null,

  hydrate: () => {
    const session = restoreSession();

    set({
      session,
      status: session ? "authenticated" : "unauthenticated",
      error: null,
    });
  },

  login: async (credentials) => {
    set({
      status: "loading",
      error: null,
    });

    try {
      const session = await loginWithService(credentials);

      set({
        session,
        status: "authenticated",
        error: null,
      });

      return true;
    } catch (error) {
      set({
        session: null,
        status: "unauthenticated",
        error: getAuthError(error),
      });

      return false;
    }
  },

  register: async (input) => {
    set({
      status: "loading",
      error: null,
    });

    try {
      const session = await registerWithService(input);

      set({
        session,
        status: "authenticated",
        error: null,
      });

      return true;
    } catch (error) {
      set({
        session: null,
        status: "unauthenticated",
        error: getAuthError(error),
      });

      return false;
    }
  },

  logout: () => {
    logoutWithService();

    set({
      session: null,
      status: "unauthenticated",
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export const selectAuthUser = (state: AuthState): AuthUser | null =>
  state.session?.user ?? null;

export const selectIsAuthenticated = (state: AuthState) =>
  state.status === "authenticated" && state.session !== null;

export const selectIsAdmin = (state: AuthState) =>
  state.session?.user.role === "admin";
