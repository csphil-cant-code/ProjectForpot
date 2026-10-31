import type { CSSProperties } from "react";

/**
 * Cash mark built from the BSP 1000-peso bill image. The optimized square
 * asset lives in `public/cash.png` and is drawn on a transparent background so
 * it sits cleanly inside the white icon tiles.
 */
export function CashLogo({
  size = 20,
  decorative = false,
  className,
}: {
  size?: number;
  /** Set when a visible "Cash" label already sits next to the icon. */
  decorative?: boolean;
  className?: string;
}) {
  const style: CSSProperties = { width: size, height: size };

  return (
    <img
      src="/cash.png"
      alt={decorative ? "" : "Cash"}
      width={size}
      height={size}
      style={style}
      className={className ? `cash-logo ${className}` : "cash-logo"}
      draggable={false}
    />
  );
}
