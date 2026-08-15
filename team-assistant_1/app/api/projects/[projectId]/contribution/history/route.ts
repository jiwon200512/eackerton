import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { DEFAULT_AVATAR_EMOJI } from "@/lib/avatar";
import { db } from "@/lib/db/client";
import { contributionSnapshots } from "@/lib/db/schema";
import { toErrorResponse } from "@/lib/errors";
import { loadProjectMembersWithAvatars } from "@/lib/members/query";
import { requireProjectAccess } from "@/lib/projects/access";
import type { ContributionResult } from "@/services/contribution/calculate";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectAccess(projectId, user.id);

    const [rows, memberProfiles] = await Promise.all([
      db
        .select()
        .from(contributionSnapshots)
        .where(eq(contributionSnapshots.projectId, projectId))
        .orderBy(asc(contributionSnapshots.createdAt)),
      loadProjectMembersWithAvatars(projectId),
    ]);
    const avatarByMemberId = new Map(
      memberProfiles.map(({ member, avatarEmoji }) => [member.id, avatarEmoji])
    );

    const snapshots = rows.map((snapshot, index) => {
      let scores: ContributionResult[] = [];
      try {
        const parsed = JSON.parse(snapshot.scores) as unknown;
        if (Array.isArray(parsed)) {
          scores = parsed.filter(
            (item): item is ContributionResult =>
              !!item &&
              typeof item === "object" &&
              typeof (item as ContributionResult).memberId === "string" &&
              typeof (item as ContributionResult).name === "string" &&
              typeof (item as ContributionResult).percentage === "number"
          );
        }
      } catch {
        scores = [];
      }

      return {
        id: snapshot.id,
        createdAt: snapshot.createdAt.getTime(),
        sequence: index + 1,
        members: scores.map((score) => ({
          memberId: score.memberId,
          name: score.name,
          avatarEmoji:
            avatarByMemberId.get(score.memberId) ?? DEFAULT_AVATAR_EMOJI,
          percentage: score.percentage,
        })),
      };
    });

    return NextResponse.json({ snapshots });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
