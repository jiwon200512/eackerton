import type { MemberDTO } from "@/lib/types";

interface MemberRow {
  id: string;
  projectId: string;
  userId: string | null;
  name: string;
  createdAt: Date;
}

export function toMemberDTO(member: MemberRow, currentUserId: string): MemberDTO {
  return {
    id: member.id,
    projectId: member.projectId,
    name: member.name,
    claimed: member.userId !== null,
    claimedByMe: member.userId === currentUserId,
    createdAt: member.createdAt.getTime(),
  };
}
