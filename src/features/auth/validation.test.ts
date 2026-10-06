import { describe, expect, it } from "vitest";

import {
  hasAuthErrors,
  normalizeEmail,
  validateLoginInput,
  validateRegisterInput,
} from "./validation";

describe("auth validation", () => {
  it("normalizes email addresses", () => {
    expect(normalizeEmail("  USER@Example.COM  ")).toBe("user@example.com");
  });

  it("accepts valid login input", () => {
    const errors = validateLoginInput({
      email: "shopper@example.com",
      password: "password123",
    });

    expect(errors).toEqual({});
    expect(hasAuthErrors(errors)).toBe(false);
  });

  it("rejects invalid login input", () => {
    const errors = validateLoginInput({
      email: "not-an-email",
      password: "",
    });

    expect(errors.email).toBe("Enter a valid email address.");
    expect(errors.password).toBe("Password is required.");
    expect(hasAuthErrors(errors)).toBe(true);
  });

  it("accepts valid registration input", () => {
    const errors = validateRegisterInput({
      name: "Sajjad",
      email: "sajjad@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(errors).toEqual({});
  });

  it("rejects short passwords and mismatched confirmation", () => {
    const errors = validateRegisterInput({
      name: "S",
      email: "invalid",
      password: "123",
      confirmPassword: "456",
    });

    expect(errors.name).toBe("Name must be at least 2 characters.");
    expect(errors.email).toBe("Enter a valid email address.");
    expect(errors.password).toBe("Password must be at least 8 characters.");
    expect(errors.confirmPassword).toBe("Passwords do not match.");
  });
});
