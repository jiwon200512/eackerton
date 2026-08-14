import { NextResponse } from "next/server";
import { deleteCurrentSession } from "@/lib/auth/session";
import { toErrorResponse } from "@/lib/errors";

export async function POST() {
  try {
    await deleteCurrentSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
