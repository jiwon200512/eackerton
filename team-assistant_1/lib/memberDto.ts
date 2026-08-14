import type { MemberDTO } from "@/lib/types";

interface MemberRow {
  id: string;
  projectId: string;
  userId: string | null;
  name: string;
  createdAt: Date;
}

export function toMemberDTO(
  member: MemberRow,
  currentUserId: string,
  ownerUserId: string | null = null
): MemberDTO {
  const isLeader = member.userId !== null && member.userId === ownerUserId;
  return {
    id: member.id,
    projectId: member.projectId,
    name: member.name,
    claimed: member.userId !== null,
    claimedByMe: member.userId === currentUserId,
    isLeader,
    role: member.userId === null ? null : isLeader ? "OWNER" : "MEMBER",
    createdAt: member.createdAt.getTime(),
  };
}
