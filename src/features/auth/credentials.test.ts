import { describe, expect, it } from "vitest";

import {
  hashMockPassword,
  verifyMockPassword,
} from "./credentials";

describe("mock credential helpers", () => {
  it("creates a stable SHA-256 hash", async () => {
    const firstHash = await hashMockPassword("password123");
    const secondHash = await hashMockPassword("password123");

    expect(firstHash).toBe(secondHash);
    expect(firstHash).toHaveLength(64);
    expect(firstHash).not.toBe("password123");
  });

  it("verifies the correct password", async () => {
    const hash = await hashMockPassword("securepass123");

    await expect(
      verifyMockPassword("securepass123", hash),
    ).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashMockPassword("securepass123");

    await expect(
      verifyMockPassword("wrongpassword", hash),
    ).resolves.toBe(false);
  });
});
