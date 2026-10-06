import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "./auth-store";

describe("auth store", () => {
  beforeEach(() => {
    localStorage.clear();

    useAuthStore.setState({
      session: null,
      status: "idle",
      error: null,
    });
  });

  it("hydrates as unauthenticated when no session exists", () => {
    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().status).toBe("unauthenticated");
    expect(useAuthStore.getState().session).toBeNull();
  });

  it("logs in a demo customer", async () => {
    const success = await useAuthStore.getState().login({
      email: "customer@shopsphere.dev",
      password: "Customer123!",
    });

    const state = useAuthStore.getState();

    expect(success).toBe(true);
    expect(state.status).toBe("authenticated");
    expect(state.session?.user.role).toBe("customer");
    expect(state.error).toBeNull();
  });

  it("logs in a demo administrator", async () => {
    const success = await useAuthStore.getState().login({
      email: "admin@shopsphere.dev",
      password: "Admin123!",
    });

    const state = useAuthStore.getState();

    expect(success).toBe(true);
    expect(state.session?.user.role).toBe("admin");
  });

  it("exposes a safe error after failed login", async () => {
    const success = await useAuthStore.getState().login({
      email: "customer@shopsphere.dev",
      password: "wrong-password",
    });

    const state = useAuthStore.getState();

    expect(success).toBe(false);
    expect(state.status).toBe("unauthenticated");
    expect(state.session).toBeNull();
    expect(state.error).toEqual({
      code: "INVALID_CREDENTIALS",
      message: "Email or password is incorrect.",
    });
  });

  it("registers a new customer", async () => {
    const success = await useAuthStore.getState().register({
      name: "Store Shopper",
      email: "store@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    const state = useAuthStore.getState();

    expect(success).toBe(true);
    expect(state.status).toBe("authenticated");
    expect(state.session?.user.email).toBe("store@example.com");
    expect(state.session?.user.role).toBe("customer");
  });

  it("logs out and clears auth state", async () => {
    await useAuthStore.getState().login({
      email: "customer@shopsphere.dev",
      password: "Customer123!",
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.status).toBe("unauthenticated");
    expect(state.session).toBeNull();
    expect(state.error).toBeNull();
  });

  it("clears the current auth error", async () => {
    await useAuthStore.getState().login({
      email: "customer@shopsphere.dev",
      password: "wrong-password",
    });

    expect(useAuthStore.getState().error).not.toBeNull();

    useAuthStore.getState().clearError();

    expect(useAuthStore.getState().error).toBeNull();
  });
});
