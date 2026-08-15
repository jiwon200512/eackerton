import { NextRequest, NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import {
  getProjectOwnerUserId,
  getProjectRole,
  requireProjectAccess,
} from "@/lib/projects/access";
import { toMemberDTO } from "@/lib/memberDto";
import { loadProjectMembersWithAvatars } from "@/lib/members/query";
import { toProjectDTO } from "@/lib/projectDto";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    const project = await requireProjectAccess(projectId, user.id);
    const [memberProfiles, currentUserRole, ownerUserId] = await Promise.all([
      loadProjectMembersWithAvatars(projectId),
      getProjectRole(projectId, user.id),
      getProjectOwnerUserId(projectId),
    ]);
    return NextResponse.json({
      project: toProjectDTO(project),
      currentUserRole,
      members: memberProfiles.map(({ member, avatarEmoji }) =>
        toMemberDTO(member, user.id, ownerUserId, avatarEmoji)
      ),
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
