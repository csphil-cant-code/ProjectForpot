import type { CategorySpend } from "../../types";
import { peso } from "../../utils/format";
import { ProgressBar, budgetTone } from "../common/ProgressBar";

export function BudgetWatch({
  items,
  onManage,
}: {
  items: CategorySpend[];
  onManage: () => void;
}) {
  const visible = items.filter((item) => item.budget > 0).slice(0, 4);

  return (
    <section className="card card--pad">
      <div className="section__head">
        <h2 className="section__title">Budget watch</h2>
        <button type="button" className="linkish" onClick={onManage}>
          Manage
        </button>
      </div>

      <div className="budget-list">
        {visible.length === 0 ? (
          <p className="muted">No budgets set yet. Add one to start watching.</p>
        ) : (
          visible.map(({ category, spent, budget, ratio }) => (
            <div className="budget-row" key={category.id}>
              <div className="budget-row__top">
                <span className="budget-row__name">
                  <span
                    className="dot"
                    style={{ background: category.color }}
                    aria-hidden="true"
                  />
                  {category.emoji} {category.name}
                </span>
                <span className="budget-row__nums">
                  {peso(spent)} <span className="muted">/ {peso(budget)}</span>
                </span>
              </div>
              <ProgressBar
                ratio={ratio}
                tone={budgetTone(ratio)}
                label={`${category.name} budget usage`}
              />
              <span
                className={`budget-row__note${ratio > 1 ? " is-over" : ""}`}
              >
                {ratio > 1
                  ? `${peso(spent - budget)} over budget`
                  : `${peso(budget - spent)} left`}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
