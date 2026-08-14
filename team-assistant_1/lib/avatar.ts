export const AVATAR_EMOJIS = [
  "🐶",
  "🐱",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐸",
  "🐵",
  "🐷",
  "🐧",
  "🐹",
  "🦄",
  "🐙",
] as const;

export const DEFAULT_AVATAR_EMOJI = "🐶";

export type AvatarEmoji = (typeof AVATAR_EMOJIS)[number];

export function isAvatarEmoji(value: unknown): value is AvatarEmoji {
  return (
    typeof value === "string" &&
    (AVATAR_EMOJIS as readonly string[]).includes(value)
  );
}

export function normalizeAvatarEmoji(value: unknown): AvatarEmoji {
  return isAvatarEmoji(value) ? value : DEFAULT_AVATAR_EMOJI;
}
