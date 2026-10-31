import { useState } from "react";
import type { FormEvent } from "react";
import type { TxKind } from "../../types";
import { useAppState, budgetStore } from "../../stores/budgetStore";
import { uiStore } from "../../stores/uiStore";
import { CATEGORY_ICONS, QUICK_CATEGORIES } from "../../lib/categoryIcons";
import { Icon } from "../common/Icon";

export function AddCategoryCard() {
  const state = useAppState();
  const [kind, setKind] = useState<TxKind>("expense");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(CATEGORY_ICONS[0].emoji);
  const [budget, setBudget] = useState("");
  const [iconsOpen, setIconsOpen] = useState(false);

  const suggestions = QUICK_CATEGORIES.filter(
    (category) => category.kind === kind,
  );

  const isAdded = (name: string) =>
    state.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

  const quickAdd = (preset: (typeof QUICK_CATEGORIES)[number]) => {
    const created = budgetStore.addCategory({
      name: preset.name,
      emoji: preset.emoji,
      monthlyBudget: 0,
      kind: preset.kind,
    });

    if (!created) {
      uiStore.notify(`“${preset.name}” is already in your list.`);
      return;
    }

    uiStore.notify(
      created.kind === "expense"
        ? `“${created.name}” added — set a limit on its card.`
        : `“${created.name}” added.`,
    );
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = budgetStore.addCategory({
      name,
      emoji,
      monthlyBudget: Number(budget) || 0,
      kind,
    });

    if (!created) {
      uiStore.notify("Use a unique category name.");
      return;
    }

    uiStore.notify(`“${created.name}” added.`);
    setName("");
    setBudget("");
    setIconsOpen(false);
  };

  return (
    <form className="card card--pad add-cat" onSubmit={submit}>
      <div className="add-cat__head">
        <div>
          <h2 className="section__title">New category</h2>
          <p className="muted">Tap a suggestion, or create your own below.</p>
        </div>

        <div
          className="toggle-group toggle-group--sm"
          role="group"
          aria-label="Category type"
        >
          <button
            type="button"
            className={`toggle-group__btn${
              kind === "expense" ? " is-active" : ""
            }`}
            onClick={() => setKind("expense")}
            aria-pressed={kind === "expense"}
          >
            Expense
          </button>
          <button
            type="button"
            className={`toggle-group__btn${
              kind === "income" ? " is-active" : ""
            }`}
            onClick={() => setKind("income")}
            aria-pressed={kind === "income"}
          >
            Income
          </button>
        </div>
      </div>

      <div className="add-cat__quick">
        <span className="field__label">Quick add</span>
        <div className="add-cat__quick-grid">
          {suggestions.map((preset) => {
            const added = isAdded(preset.name);
            return (
              <button
                type="button"
                key={preset.name}
                className={`quick-cat${added ? " is-added" : ""}`}
                onClick={() => quickAdd(preset)}
                disabled={added}
                title={added ? "Already added" : `Add ${preset.name}`}
              >
                <span aria-hidden="true">{preset.emoji}</span>
                {preset.name}
                <Icon name={added ? "check" : "plus"} size={13} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="add-cat__divider">
        <span>Or create your own</span>
      </div>

      <div
        className={`add-cat__form${
          kind === "income" ? " add-cat__form--income" : ""
        }`}
      >
        <button
          type="button"
          className="add-cat__icon-btn"
          onClick={() => setIconsOpen((open) => !open)}
          aria-expanded={iconsOpen}
          aria-label="Choose category icon"
          title="Choose icon"
        >
          <span className="add-cat__icon-preview" aria-hidden="true">
            {emoji}
          </span>
          <span className="add-cat__icon-label">Icon</span>
        </button>

        <label className="field add-cat__name">
          <span className="field__label">Name</span>
          <input
            className="input"
            type="text"
            placeholder={
              kind === "expense" ? "e.g. Coffee fund" : "e.g. Allowance"
            }
            value={name}
            maxLength={28}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        {kind === "expense" ? (
          <label className="field add-cat__budget">
            <span className="field__label">
              Monthly limit <span className="muted">(optional)</span>
            </span>
            <input
              className="input"
              type="number"
              min="0"
              step="50"
              placeholder="0"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
          </label>
        ) : null}

        <button
          type="submit"
          className="btn btn--primary add-cat__submit"
          disabled={!name.trim()}
        >
          <Icon name="plus" size={16} />
          Add
        </button>
      </div>

      {iconsOpen ? (
        <div className="add-cat__icons-wrap">
          <span className="field__label">Pick an icon</span>
          <div
            className="add-cat__icons"
            role="group"
            aria-label="Category icon"
          >
            {CATEGORY_ICONS.map((option) => (
              <button
                type="button"
                key={option.emoji}
                className={`add-cat__icon${
                  emoji === option.emoji ? " is-active" : ""
                }`}
                onClick={() => setEmoji(option.emoji)}
                aria-label={option.label}
                aria-pressed={emoji === option.emoji}
                title={option.label}
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
