import type { ReactNode } from "react";

export function EmptyState({
  emoji = "🌱",
  title,
  description,
  action,
}: {
  emoji?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty__emoji" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="empty__title">{title}</h3>
      <p className="empty__text">{description}</p>
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}
