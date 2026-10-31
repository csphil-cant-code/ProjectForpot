import type { IconName } from "./Icon";
import { icon } from "./Icon";
import { currentMonth, monthLabel, shiftMonth } from "../../utils/date";
import { clamp } from "../../utils/format";
import { escapeHtml } from "../../utils/html";

export const progressBar = (
  ratio: number,
  tone: "ok" | "warn" | "over" = "ok",
  label = "",
): string => {
  const safe = clamp(ratio, 0, 1);
  const width = `${safe * 100}%`;
  return `<div
    class="bar"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="${Math.round(safe * 100)}"
    ${label ? `aria-label="${escapeHtml(label)}"` : ""}
  >
    <span class="bar__fill bar__fill--${tone}" style="width:${width}"></span>
  </div>`;
};

export const budgetTone = (ratio: number): "ok" | "warn" | "over" => {
  if (ratio > 1) return "over";
  if (ratio >= 0.8) return "warn";
  return "ok";
};

export const pageHeader = ({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: string;
}): string => `
  <header class="page-head">
    <div class="page-head__text">
      ${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h1 class="page-head__title">${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="page-head__sub">${escapeHtml(subtitle)}</p>` : ""}
    </div>
    ${actions ? `<div class="page-head__actions">${actions}</div>` : ""}
  </header>`;

export const monthSwitcher = (month: string): string => {
  const thisMonth = currentMonth();
  const atLatest = month >= thisMonth;

  return `
    <div class="month-switch">
      <button
        type="button"
        class="month-switch__btn"
        data-action="month-prev"
        aria-label="Previous month"
      >${icon("chevron-left", 18)}</button>

      <div class="month-switch__label">
        <span class="month-switch__value">${monthLabel(month)}</span>
        ${
          month !== thisMonth
            ? `<button type="button" class="month-switch__reset" data-action="month-reset">Back to this month</button>`
            : `<span class="month-switch__hint">Current month</span>`
        }
      </div>

      <button
        type="button"
        class="month-switch__btn"
        data-action="month-next"
        ${atLatest ? "disabled" : ""}
        aria-label="Next month"
      >${icon("chevron-right", 18)}</button>
    </div>`;
};

export const emptyState = ({
  emoji = "🌱",
  title,
  description,
  action,
}: {
  emoji?: string;
  title: string;
  description: string;
  action?: string;
}): string => `
  <div class="empty">
    <span class="empty__emoji" aria-hidden="true">${emoji}</span>
    <h3 class="empty__title">${escapeHtml(title)}</h3>
    <p class="empty__text">${escapeHtml(description)}</p>
    ${action ? `<div class="empty__action">${action}</div>` : ""}
  </div>`;

export const toast = (message: string): string => `
  <div class="toast" role="status" aria-live="polite">
    <span class="toast__icon">${icon("check", 16)}</span>
    <span>${escapeHtml(message)}</span>
    <button
      type="button"
      class="toast__close"
      data-action="dismiss-toast"
      aria-label="Dismiss notification"
    >${icon("close", 14)}</button>
  </div>`;

export const miniStat = ({
  label,
  value,
  hint,
  iconName,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  iconName: IconName;
  tone: "income" | "expense" | "net" | "budget";
}): string => `
  <article class="mini-stat mini-stat--${tone}">
    <span class="mini-stat__icon">${icon(iconName, 17)}</span>
    <div class="mini-stat__body">
      <span class="mini-stat__label">${escapeHtml(label)}</span>
      <strong class="mini-stat__value">${value}</strong>
      ${hint ? `<span class="mini-stat__hint">${escapeHtml(hint)}</span>` : ""}
    </div>
  </article>`;

export const monthStep = (month: string, delta: number): string =>
  shiftMonth(month, delta);
