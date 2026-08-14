import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import {
  getProjectOwnerUserId,
  getProjectRole,
  requireProjectAccess,
} from "@/lib/projects/access";
import { toMemberDTO } from "@/lib/memberDto";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    const project = await requireProjectAccess(projectId, user.id);
    const [projectMembers, currentUserRole, ownerUserId] = await Promise.all([
      db.select().from(members).where(eq(members.projectId, projectId)),
      getProjectRole(projectId, user.id),
      getProjectOwnerUserId(projectId),
    ]);
    return NextResponse.json({
      project,
      currentUserRole,
      members: projectMembers.map((m) =>
        toMemberDTO(m, user.id, ownerUserId)
      ),
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
