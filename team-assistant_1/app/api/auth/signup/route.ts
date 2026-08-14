import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import {
  firstValidationError,
  signupSchema,
} from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { AppError, toErrorResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(
        "INVALID_SIGNUP",
        firstValidationError(parsed.error),
        400
      );
    }

    const { name, username, password, email } = parsed.data;
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser) {
      throw new AppError(
        "USERNAME_TAKEN",
        "이미 사용 중인 아이디입니다.",
        409
      );
    }

    const passwordHash = await hashPassword(password);
    let user: typeof users.$inferSelect;
    try {
      [user] = await db
        .insert(users)
        .values({ name, username, email, passwordHash })
        .returning();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed: users.username")
      ) {
        throw new AppError(
          "USERNAME_TAKEN",
          "이미 사용 중인 아이디입니다.",
          409
        );
      }
      throw error;
    }

    await createSession(user.id);
    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
