import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/projects/access";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    const project = await requireProjectAccess(projectId, user.id);
    const projectMembers = await db
      .select()
      .from(members)
      .where(eq(members.projectId, projectId));
    return NextResponse.json({ project, members: projectMembers });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
