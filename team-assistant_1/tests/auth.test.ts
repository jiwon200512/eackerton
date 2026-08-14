import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { loginSchema, signupSchema } from "@/lib/auth/validation";

describe("authentication validation", () => {
  it("normalizes usernames and accepts a valid signup", () => {
    const result = signupSchema.safeParse({
      name: "김지원",
      username: "  JiWon_123  ",
      password: "password123",
      passwordConfirm: "password123",
      email: "Example@Naver.com",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("jiwon_123");
      expect(result.data.email).toBe("example@naver.com");
    }
  });

  it("rejects short passwords and mismatched confirmation", () => {
    const result = signupSchema.safeParse({
      name: "김지원",
      username: "jiwon123",
      password: "short",
      passwordConfirm: "different",
      email: "example@naver.com",
    });

    expect(result.success).toBe(false);
  });

  it("treats the login identifier as a username, not an email", () => {
    expect(
      loginSchema.safeParse({ username: "jiwon123", password: "password123" })
        .success
    ).toBe(true);
    expect(
      loginSchema.safeParse({
        username: "jiwon@example.com",
        password: "password123",
      }).success
    ).toBe(false);
  });
});

describe("password hashing", () => {
  it("stores a salted scrypt hash and verifies the original password", async () => {
    const password = "correct horse battery staple";
    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);

    expect(firstHash).not.toContain(password);
    expect(firstHash).not.toBe(secondHash);
    await expect(verifyPassword(password, firstHash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", firstHash)).resolves.toBe(false);
  });
});
