import { useMemo } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { MonthSwitcher } from "../../components/layout/MonthSwitcher";
import { BudgetCard } from "../../components/budgets/BudgetCard";
import { AddCategoryCard } from "../../components/budgets/AddCategoryCard";
import { ProgressBar, budgetTone } from "../../components/common/ProgressBar";
import { EmptyState } from "../../components/common/EmptyState";
import { Icon } from "../../components/common/Icon";
import { useAppState, budgetStore } from "../../stores/budgetStore";
import { uiStore, useUiState } from "../../stores/uiStore";
import { budgetSummary, categoryBreakdown } from "../../lib/calc";
import { monthLabel } from "../../utils/date";
import { percent, peso } from "../../utils/format";

export function BudgetsPage() {
  const state = useAppState();
  const { month } = useUiState();

  const summary = useMemo(() => budgetSummary(state, month), [state, month]);
  const items = useMemo(
    () =>
      categoryBreakdown(state, month).filter(
        (item) => item.category.kind === "expense",
      ),
    [state, month],
  );

  const remove = (categoryId: string) => {
    const removed = budgetStore.deleteCategory(categoryId);
    uiStore.notify(
      removed
        ? "Category removed."
        : "Can’t delete: transactions already use this category.",
    );
  };

  return (
    <>
      <PageHeader
        eyebrow={monthLabel(month)}
        title="Budgets"
        subtitle="Set monthly limits per category and see how much is left."
        actions={<MonthSwitcher />}
      />

      <section className="budget-hero">
        <div className="budget-hero__main">
          <span className="budget-hero__label">Remaining this month</span>
          <strong
            className={`budget-hero__value${
              summary.remaining < 0 ? " is-over" : ""
            }`}
          >
            {peso(summary.remaining)}
          </strong>
          <span className="budget-hero__hint">
            {summary.budget > 0
              ? `${peso(summary.spent)} spent of ${peso(summary.budget)} budget`
              : "No monthly budget set yet"}
          </span>
          <ProgressBar
            ratio={summary.ratio}
            tone={budgetTone(summary.ratio)}
            label="Overall budget usage"
          />
        </div>

        <div className="budget-hero__stats">
          <div>
            <span className="muted">Budget</span>
            <strong>{peso(summary.budget)}</strong>
          </div>
          <div>
            <span className="muted">Spent</span>
            <strong>{peso(summary.spent)}</strong>
          </div>
          <div>
            <span className="muted">Used</span>
            <strong>{percent(summary.ratio)}</strong>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <EmptyState
          emoji="🪴"
          title="No categories yet"
          description="Use Quick add below or create your own category to start planning."
        />
      ) : (
        <section className="budget-grid">
          {items.map((item) => (
            <BudgetCard
              key={item.category.id}
              item={item}
              onBudget={(categoryId, value) =>
                budgetStore.setBudget(categoryId, value)
              }
              onDelete={remove}
            />
          ))}
        </section>
      )}

      <AddCategoryCard />

      <p className="note">
        <Icon name="leaf" size={15} />
        Budgets refresh automatically as you log expenses. Flip between months
        to compare.
      </p>
    </>
  );
}
