import { clamp } from "../../utils/format";

export function ProgressBar({
  ratio,
  tone = "ok",
  label,
}: {
  ratio: number;
  tone?: "ok" | "warn" | "over";
  label?: string;
}) {
  const width = `${clamp(ratio, 0, 1) * 100}%`;
  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamp(ratio, 0, 1) * 100)}
      aria-label={label}
    >
      <span className={`bar__fill bar__fill--${tone}`} style={{ width }} />
    </div>
  );
}

export const budgetTone = (ratio: number): "ok" | "warn" | "over" => {
  if (ratio > 1) return "over";
  if (ratio >= 0.8) return "warn";
  return "ok";
};
