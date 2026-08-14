import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const TEST_DB = path.join(process.cwd(), "data", "test-profile.db");
const authState = vi.hoisted(() => ({ userId: "profile-user" as string | null }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session", () => ({
  requireUser: vi.fn(async () => {
    if (!authState.userId) {
      const { Errors } = await import("@/lib/errors");
      throw Errors.unauthorized();
    }
    const { db } = await import("@/lib/db/client");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        email: users.email,
        avatarEmoji: users.avatarEmoji,
      })
      .from(users)
      .where(eq(users.id, authState.userId));
    if (!user) throw new Error("test user missing");
    return user;
  }),
  createSession: vi.fn(async () => undefined),
}));

function cleanTestDb() {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    const file = TEST_DB + suffix;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

let projectId: string;

beforeAll(async () => {
  cleanTestDb();
  process.env.TURSO_DATABASE_URL = `file:${TEST_DB}`;
  const { db } = await import("@/lib/db/client");
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  const { members, projects, projectUsers, users } = await import(
    "@/lib/db/schema"
  );
  const { hashPassword } = await import("@/lib/auth/password");
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  await db.insert(users).values({
    id: "profile-user",
    username: "profile-user",
    name: "박민수",
    email: "profile@example.com",
    passwordHash: await hashPassword("current-password"),
  });
  const [project] = await db
    .insert(projects)
    .values({ name: "프로필 테스트" })
    .returning();
  projectId = project.id;
  await db.insert(projectUsers).values({
    projectId,
    userId: "profile-user",
    role: "OWNER",
  });
  await db.insert(members).values([
    { projectId, userId: "profile-user", name: "박민수" },
    { projectId, name: "초대 대기" },
  ]);
});

beforeEach(() => {
  authState.userId = "profile-user";
});

afterAll(async () => {
  const { client } = await import("@/lib/db/client");
  client.close();
});

describe.sequential("profile API", () => {
  it("rejects an unauthenticated profile request", async () => {
    authState.userId = null;
    const { GET } = await import("@/app/api/profile/route");
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("returns only the safe profile DTO with the default avatar", async () => {
    const { GET } = await import("@/app/api/profile/route");
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.user).toMatchObject({
      name: "박민수",
      username: "profile-user",
      email: "profile@example.com",
      avatarEmoji: "🐶",
    });
    expect(body.user).not.toHaveProperty("passwordHash");
  });

  it("updates a whitelisted avatar and rejects arbitrary text", async () => {
    const { PATCH } = await import("@/app/api/profile/avatar/route");
    const validResponse = await PATCH(
      new NextRequest("http://localhost/api/profile/avatar", {
        method: "PATCH",
        body: JSON.stringify({ avatarEmoji: "🐼" }),
      })
    );
    expect(validResponse.status).toBe(200);

    const invalidResponse = await PATCH(
      new NextRequest("http://localhost/api/profile/avatar", {
        method: "PATCH",
        body: JSON.stringify({ avatarEmoji: "not-an-avatar" }),
      })
    );
    expect(invalidResponse.status).toBe(400);

    const { db } = await import("@/lib/db/client");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const [stored] = await db
      .select({ avatarEmoji: users.avatarEmoji })
      .from(users)
      .where(eq(users.id, "profile-user"));
    expect(stored.avatarEmoji).toBe("🐼");
  });

  it("keeps linked member avatars and fallback avatars in the safe DTO", async () => {
    const { GET } = await import("@/app/api/projects/[projectId]/route");
    const response = await GET(new NextRequest("http://localhost"), {
      params: Promise.resolve({ projectId }),
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(
      body.members.find((member: { claimed: boolean }) => member.claimed)
        .avatarEmoji
    ).toBe("🐼");
    expect(
      body.members.find((member: { claimed: boolean }) => !member.claimed)
        .avatarEmoji
    ).toBe("🐶");
  });

  it("rejects an incorrect current password without changing the hash", async () => {
    const { db } = await import("@/lib/db/client");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const { POST } = await import("@/app/api/profile/password/route");
    const [before] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, "profile-user"));

    const response = await POST(
      new NextRequest("http://localhost/api/profile/password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: "wrong-password",
          newPassword: "updated-password",
        }),
      })
    );
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("INVALID_CURRENT_PASSWORD");

    const [after] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, "profile-user"));
    expect(after.passwordHash).toBe(before.passwordHash);
  });

  it("changes the scrypt hash and accepts only the new password at login", async () => {
    const { db } = await import("@/lib/db/client");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const { verifyPassword } = await import("@/lib/auth/password");
    const [before] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, "profile-user"));
    const { POST: changeProfilePassword } = await import(
      "@/app/api/profile/password/route"
    );
    const changeResponse = await changeProfilePassword(
      new NextRequest("http://localhost/api/profile/password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: "current-password",
          newPassword: "updated-password",
        }),
      })
    );
    expect(changeResponse.status).toBe(200);

    const [after] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, "profile-user"));
    expect(after.passwordHash).not.toBe(before.passwordHash);
    await expect(
      verifyPassword("updated-password", after.passwordHash)
    ).resolves.toBe(true);

    const { POST: login } = await import("@/app/api/auth/login/route");
    const newPasswordLogin = await login(
      new NextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: "profile-user",
          password: "updated-password",
        }),
      })
    );
    expect(newPasswordLogin.status).toBe(200);

    const oldPasswordLogin = await login(
      new NextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: "profile-user",
          password: "current-password",
        }),
      })
    );
    expect(oldPasswordLogin.status).toBe(401);
  });
});
