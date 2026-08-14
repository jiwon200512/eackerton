import type { MemberDTO } from "@/lib/types";
import { DEFAULT_AVATAR_EMOJI, normalizeAvatarEmoji } from "@/lib/avatar";

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
  ownerUserId: string | null = null,
  avatarEmoji: string = DEFAULT_AVATAR_EMOJI
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
    avatarEmoji: normalizeAvatarEmoji(avatarEmoji),
    createdAt: member.createdAt.getTime(),
  };
}
