import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { isAvatarEmoji } from "@/lib/avatar";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { Errors, toErrorResponse } from "@/lib/errors";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    if (!isAvatarEmoji(body.avatarEmoji)) throw Errors.invalidAvatar();

    const [updated] = await db
      .update(users)
      .set({ avatarEmoji: body.avatarEmoji, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning({ avatarEmoji: users.avatarEmoji });

    return NextResponse.json({ avatarEmoji: updated.avatarEmoji });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
