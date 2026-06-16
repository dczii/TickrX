interface AvatarProps {
  initials: string;
  /** HSL hue 0–360 for a deterministic per-user color. */
  hue?: number;
  size?: number;
}

export default function Avatar({ initials, hue = 158, size = 36 }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-full font-mono font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `hsl(${hue} 60% 22%)`,
        color: `hsl(${hue} 70% 70%)`,
      }}
    >
      {initials}
    </span>
  );
}
