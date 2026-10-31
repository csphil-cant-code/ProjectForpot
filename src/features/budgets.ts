import type { AppState } from "../types";
import type { UiState } from "../stores/uiStore";
import { addCategoryCard, budgetCard } from "../components/budgets";
import { emptyState, monthSwitcher, pageHeader, progressBar, budgetTone } from "../components/common/ui";
import { icon } from "../components/common/Icon";
import { budgetSummary, categoryBreakdown } from "../lib/calc";
import { monthLabel } from "../utils/date";
import { percent, peso } from "../utils/format";

export const budgetsPage = (state: AppState, ui: UiState): string => {
  const { month } = ui;
  const summary = budgetSummary(state, month);
  const items = categoryBreakdown(state, month).filter(
    (item) => item.category.kind === "expense",
  );

  return `
    ${pageHeader({
      eyebrow: monthLabel(month),
      title: "Budgets",
      subtitle: "Set monthly limits per category and see how much is left.",
      actions: monthSwitcher(month),
    })}

    <section class="budget-hero">
      <div class="budget-hero__main">
        <span class="budget-hero__label">Remaining this month</span>
        <strong class="budget-hero__value${summary.remaining < 0 ? " is-over" : ""}">
          ${peso(summary.remaining)}
        </strong>
        <span class="budget-hero__hint">
          ${
            summary.budget > 0
              ? `${peso(summary.spent)} spent of ${peso(summary.budget)} budget`
              : "No monthly budget set yet"
          }
        </span>
        ${progressBar(summary.ratio, budgetTone(summary.ratio), "Overall budget usage")}
      </div>

      <div class="budget-hero__stats">
        <div>
          <span class="muted">Budget</span>
          <strong>${peso(summary.budget)}</strong>
        </div>
        <div>
          <span class="muted">Spent</span>
          <strong>${peso(summary.spent)}</strong>
        </div>
        <div>
          <span class="muted">Used</span>
          <strong>${percent(summary.ratio)}</strong>
        </div>
      </div>
    </section>

    ${
      items.length === 0
        ? emptyState({
            emoji: "🪴",
            title: "No categories yet",
            description:
              "Use Quick add below or create your own category to start planning.",
          })
        : `<section class="budget-grid">
            ${items.map((item) => budgetCard(item, ui)).join("")}
          </section>`
    }

    ${addCategoryCard(state, ui)}

    <p class="note">
      ${icon("leaf", 15)}
      Budgets refresh automatically as you log expenses. Flip between months to compare.
    </p>`;
};
