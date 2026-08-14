import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import {
  firstValidationError,
  loginSchema,
} from "@/lib/auth/validation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { AppError, toErrorResponse } from "@/lib/errors";

const INVALID_CREDENTIALS_MESSAGE =
  "아이디 또는 비밀번호가 올바르지 않습니다.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(
        "INVALID_LOGIN",
        firstValidationError(parsed.error),
        400
      );
    }

    const { username, password } = parsed.data;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      // Keep failed-login work comparable without revealing username existence.
      await hashPassword(password);
      throw new AppError(
        "INVALID_CREDENTIALS",
        INVALID_CREDENTIALS_MESSAGE,
        401
      );
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        INVALID_CREDENTIALS_MESSAGE,
        401
      );
    }

    await createSession(user.id);
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
