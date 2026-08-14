import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Errors, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/projects/access";

type Params = { params: Promise<{ projectId: string; memberId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, memberId } = await params;
    await requireProjectAccess(projectId, user.id);
    const [existing] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));
    if (!existing) throw Errors.notFound("팀원");

    // Tasks assigned to this member become unassigned (assigneeId -> NULL)
    // via the ON DELETE SET NULL foreign key defined in the schema.
    await db.delete(members).where(eq(members.id, memberId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
