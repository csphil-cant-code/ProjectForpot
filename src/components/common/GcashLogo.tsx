import type { CSSProperties } from "react";

/**
 * GCash brand mark. The asset lives in `public/image.png` so it resolves at
 * `/image.png` in dev and in the production build.
 */
export function GcashLogo({
  size = 20,
  decorative = false,
  className,
}: {
  size?: number;
  /** Set when a visible "GCash" label already sits next to the logo. */
  decorative?: boolean;
  className?: string;
}) {
  const style: CSSProperties = { width: size, height: size };

  return (
    <img
      src="/image.png"
      alt={decorative ? "" : "GCash"}
      width={size}
      height={size}
      style={style}
      className={className ? `gcash-logo ${className}` : "gcash-logo"}
      draggable={false}
    />
  );
}
