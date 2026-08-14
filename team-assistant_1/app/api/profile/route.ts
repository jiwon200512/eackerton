import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { toErrorResponse } from "@/lib/errors";

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatarEmoji: user.avatarEmoji,
      },
    });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
