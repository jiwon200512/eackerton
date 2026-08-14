import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { requireUser } from "@/lib/auth/session";
import {
  firstValidationError,
  passwordChangeSchema,
} from "@/lib/auth/validation";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireUser();
    const body = await request.json().catch(() => ({}));
    const parsed = passwordChangeSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(
        "INVALID_PASSWORD_CHANGE",
        firstValidationError(parsed.error),
        400
      );
    }

    const [user] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);
    if (!user) throw Errors.unauthorized();

    const matches = await verifyPassword(
      parsed.data.currentPassword,
      user.passwordHash
    );
    if (!matches) throw Errors.invalidCurrentPassword();

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, authUser.id));

    return NextResponse.json({
      ok: true,
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
