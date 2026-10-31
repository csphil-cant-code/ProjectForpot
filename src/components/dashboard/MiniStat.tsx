import type { ReactNode } from "react";
import { Icon, type IconName } from "../common/Icon";

export function MiniStat({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: IconName;
  tone: "income" | "expense" | "net" | "budget";
}) {
  return (
    <article className={`mini-stat mini-stat--${tone}`}>
      <span className="mini-stat__icon">
        <Icon name={icon} size={17} />
      </span>
      <div className="mini-stat__body">
        <span className="mini-stat__label">{label}</span>
        <strong className="mini-stat__value">{value}</strong>
        {hint ? <span className="mini-stat__hint">{hint}</span> : null}
      </div>
    </article>
  );
}
