import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { projects, members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Errors, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireUser();
    const { projectId } = await params;
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));
    if (!project) throw Errors.notFound("프로젝트");
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
