import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { inviteCodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import {
  assertProjectIsActive,
  requireProjectOwner,
} from "@/lib/projects/access";
import { generateInviteCode } from "@/lib/projects/inviteCode";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    const project = await requireProjectOwner(projectId, user.id);
    assertProjectIsActive(project);

    const [existing] = await db
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.projectId, projectId));
    if (existing) {
      return NextResponse.json({ code: existing.code });
    }

    const code = await createUniqueCode();
    const [created] = await db
      .insert(inviteCodes)
      .values({ projectId, code })
      .returning();
    return NextResponse.json({ code: created.code });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

// Regenerates the code, invalidating the old one.
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    const project = await requireProjectOwner(projectId, user.id);
    assertProjectIsActive(project);

    const code = await createUniqueCode();
    const [existing] = await db
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.projectId, projectId));

    if (existing) {
      await db.update(inviteCodes).set({ code }).where(eq(inviteCodes.projectId, projectId));
    } else {
      await db.insert(inviteCodes).values({ projectId, code });
    }
    return NextResponse.json({ code });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

async function createUniqueCode(): Promise<string> {
  // Collisions are astronomically unlikely (32^8 space) but retry a few
  // times defensively since `code` has a unique constraint.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode();
    const [clash] = await db.select().from(inviteCodes).where(eq(inviteCodes.code, code));
    if (!clash) return code;
  }
  throw new Error("Failed to generate a unique invite code");
}
