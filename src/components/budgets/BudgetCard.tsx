import { useEffect, useState } from "react";
import type { CategorySpend } from "../../types";
import { peso, percent } from "../../utils/format";
import { ProgressBar, budgetTone } from "../common/ProgressBar";
import { Icon } from "../common/Icon";

export function BudgetCard({
  item,
  onBudget,
  onDelete,
}: {
  item: CategorySpend;
  onBudget: (categoryId: string, value: number) => void;
  onDelete: (categoryId: string) => void;
}) {
  const { category, spent, budget, ratio } = item;
  const [draft, setDraft] = useState(String(budget || ""));

  useEffect(() => {
    setDraft(String(budget || ""));
  }, [budget]);

  const commit = () => {
    const value = Number(draft);
    if (Number.isFinite(value) && value >= 0) {
      onBudget(category.id, value);
    } else {
      setDraft(String(budget || ""));
    }
  };

  const over = budget > 0 && spent > budget;
  const remaining = budget - spent;

  return (
    <article className="budget-card">
      <header className="budget-card__head">
        <span
          className="budget-card__badge"
          style={{ background: category.color }}
          aria-hidden="true"
        >
          {category.emoji}
        </span>
        <div className="budget-card__title">
          <h3>{category.name}</h3>
          <span className="muted">
            {budget > 0 ? `${percent(ratio)} used` : "No budget yet"}
          </span>
        </div>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(category.id)}
          aria-label={`Delete ${category.name}`}
          title="Delete category"
        >
          <Icon name="trash" size={16} />
        </button>
      </header>

      <div className="budget-card__figures">
        <strong>{peso(spent)}</strong>
        <span className="muted">of {peso(budget)}</span>
      </div>

      <ProgressBar
        ratio={budget > 0 ? ratio : 0}
        tone={budgetTone(ratio)}
        label={`${category.name} budget usage`}
      />

      <footer className="budget-card__foot">
        <span className={over ? "text-expense" : "muted"}>
          {budget === 0
            ? "Set a monthly limit"
            : over
              ? `${peso(Math.abs(remaining))} over`
              : `${peso(remaining)} left`}
        </span>

        <label className="budget-edit">
          <span>₱</span>
          <input
            type="number"
            min="0"
            step="50"
            inputMode="numeric"
            value={draft}
            placeholder="0"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            aria-label={`Monthly budget for ${category.name}`}
          />
        </label>
      </footer>
    </article>
  );
}
