import {
  DEFAULT_AVATAR_EMOJI,
  normalizeAvatarEmoji,
} from "@/lib/avatar";

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-xl",
  lg: "h-14 w-14 text-3xl",
  xl: "h-20 w-20 text-5xl",
} as const;

export default function Avatar({
  emoji = DEFAULT_AVATAR_EMOJI,
  name,
  size = "md",
  className = "",
}: {
  emoji?: string | null;
  name?: string | null;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}) {
  const safeEmoji = normalizeAvatarEmoji(emoji);

  return (
    <span
      role="img"
      aria-label={name ? `${name} 프로필 아바타` : "프로필 아바타"}
      title={name ?? undefined}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-violet-100 bg-violet-50 ${SIZE_CLASSES[size]} ${className}`}
    >
      {safeEmoji}
    </span>
  );
}
