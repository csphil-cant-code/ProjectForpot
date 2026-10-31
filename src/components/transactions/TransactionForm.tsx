import { useState } from "react";
import type { FormEvent } from "react";
import type { AccountId, TxKind } from "../../types";
import { useAppState, budgetStore } from "../../stores/budgetStore";
import { uiStore } from "../../stores/uiStore";
import { ACCOUNT_LABEL, KIND_LABEL } from "../../lib/labels";
import { QUICK_CATEGORIES } from "../../lib/categoryIcons";
import { accountBalance } from "../../lib/calc";
import { relativeDay, todayISO } from "../../utils/date";
import { peso } from "../../utils/format";
import { CashLogo } from "../common/CashLogo";
import { GcashLogo } from "../common/GcashLogo";
import { Icon } from "../common/Icon";

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

export function TransactionForm({ onDone }: { onDone: () => void }) {
  const state = useAppState();
  const draft = uiStore.getSnapshot().draft;

  const [kind, setKind] = useState<TxKind>(draft.kind);
  const [account, setAccount] = useState<AccountId>(draft.account);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(
    state.categories.find((category) => category.kind === draft.kind)?.id ?? "",
  );
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState("");

  const categories = state.categories.filter(
    (category) => category.kind === kind,
  );
  const suggestions = QUICK_CATEGORIES.filter(
    (category) => category.kind === kind,
  );

  const changeKind = (next: TxKind) => {
    setKind(next);
    const first = state.categories.find((category) => category.kind === next);
    setCategoryId(first?.id ?? "");
    setError("");
  };

  const quickCreate = (preset: (typeof QUICK_CATEGORIES)[number]) => {
    const existing = state.categories.find(
      (category) => category.name.toLowerCase() === preset.name.toLowerCase(),
    );

    if (existing) {
      if (existing.kind === kind) {
        setCategoryId(existing.id);
        setError("");
      } else {
        uiStore.notify(`“${existing.name}” is already an income or expense category.`);
      }
      return;
    }

    const created = budgetStore.addCategory({
      name: preset.name,
      emoji: preset.emoji,
      monthlyBudget: 0,
      kind,
    });
    if (!created) {
      uiStore.notify("That category already exists.");
      return;
    }

    setCategoryId(created.id);
    setError("");
    uiStore.notify(`“${created.name}” added.`);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!categoryId) {
      setError("Pick a category first.");
      return;
    }

    budgetStore.addTransaction({
      kind,
      account,
      amount: value,
      categoryId,
      note: note.trim(),
      date,
    });
    uiStore.notify(kind === "income" ? "Income added" : "Expense added");
    onDone();
  };

  const goToBudgets = () => {
    uiStore.closeAdd();
    uiStore.setView("budgets");
  };

  return (
    <form className="tx-form" onSubmit={submit}>
      <div className="toggle-group tx-kind" role="group" aria-label="Type">
        <button
          type="button"
          className={`toggle-group__btn${
            kind === "expense" ? " is-active" : ""
          }`}
          onClick={() => changeKind("expense")}
          aria-pressed={kind === "expense"}
        >
          <Icon name="down-left" size={16} />
          Expense
        </button>
        <button
          type="button"
          className={`toggle-group__btn${kind === "income" ? " is-active" : ""}`}
          onClick={() => changeKind("income")}
          aria-pressed={kind === "income"}
        >
          <Icon name="up-right" size={16} />
          Income
        </button>
      </div>

      <div className="amount-block">
        <span className="field__label" id="tx-amount-label">
          How much?
        </span>
        <div className="amount-field">
          <span className="amount-field__currency">₱</span>
          <input
            className="amount-field__input"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setError("");
            }}
            aria-labelledby="tx-amount-label"
            autoFocus
          />
        </div>

        <div className="quick-amounts" aria-label="Quick amounts">
          {QUICK_AMOUNTS.map((value) => (
            <button
              type="button"
              key={value}
              className="quick-amounts__chip"
              onClick={() => {
                setAmount(String(value));
                setError("");
              }}
            >
              ₱{value}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="field">
        <legend className="field__label">
          {kind === "expense"
            ? "What was it for?"
            : "Where did it come from?"}
        </legend>

        {categories.length > 0 ? (
          <div className="cat-grid">
            {categories.map((category) => {
              const active = categoryId === category.id;
              return (
                <button
                  type="button"
                  key={category.id}
                  className={`cat-tile${active ? " is-active" : ""}`}
                  onClick={() => {
                    setCategoryId(category.id);
                    setError("");
                  }}
                  aria-pressed={active}
                >
                  <span
                    className="cat-tile__emoji"
                    style={{ background: category.color }}
                    aria-hidden="true"
                  >
                    {category.emoji}
                  </span>
                  <span className="cat-tile__name">{category.name}</span>
                  {active ? (
                    <Icon name="check" size={15} className="cat-tile__check" />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="tx-empty">
            <div className="tx-empty__head">
              <span className="tx-empty__emoji" aria-hidden="true">
                🌱
              </span>
              <div>
                <strong>
                  No {KIND_LABEL[kind].toLowerCase()} categories yet
                </strong>
                <p>Pick a suggestion to create one instantly.</p>
              </div>
            </div>

            <div className="tx-empty__presets">
              {suggestions.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  className="quick-cat quick-cat--sm"
                  onClick={() => quickCreate(preset)}
                >
                  <span aria-hidden="true">{preset.emoji}</span>
                  {preset.name}
                  <Icon name="plus" size={13} />
                </button>
              ))}
            </div>

            <button type="button" className="linkish" onClick={goToBudgets}>
              Or create your own category
            </button>
          </div>
        )}
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">Paid with</legend>
        <div className="account-picker">
          {(["gcash", "cash"] as AccountId[]).map((id) => {
            const active = account === id;
            return (
              <button
                type="button"
                key={id}
                className={`account-picker__btn${active ? " is-active" : ""}`}
                onClick={() => setAccount(id)}
                aria-pressed={active}
              >
                <span className="account-picker__logo">
                  {id === "gcash" ? (
                    <GcashLogo size={22} decorative />
                  ) : (
                    <CashLogo size={22} decorative />
                  )}
                </span>
                <span className="account-picker__text">
                  <strong>{ACCOUNT_LABEL[id]}</strong>
                  <span>{peso(accountBalance(state, id))}</span>
                </span>
                {active ? (
                  <Icon
                    name="check"
                    size={15}
                    className="account-picker__check"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        className={`tx-details${detailsOpen ? " is-open" : ""}`}
        onClick={() => setDetailsOpen((open) => !open)}
        aria-expanded={detailsOpen}
        aria-controls="tx-details-panel"
      >
        <span className="tx-details__title">
          <Icon
            name="chevron-right"
            size={15}
            className="tx-details__chevron"
          />
          Date &amp; note <span className="muted">(optional)</span>
        </span>
        <span className="tx-details__meta">{relativeDay(date)}</span>
      </button>

      {detailsOpen ? (
        <div className="form-row" id="tx-details-panel">
          <label className="field">
            <span className="field__label">Date</span>
            <input
              className="input"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field__label">Note</span>
            <input
              className="input"
              type="text"
              placeholder="e.g. Lunch with friends"
              value={note}
              maxLength={80}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
        </div>
      ) : null}

      {error ? (
        <p className="form-error" role="alert">
          <Icon name="alert" size={15} />
          {error}
        </p>
      ) : null}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onDone}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={categories.length === 0}
        >
          <Icon name="check" size={17} />
          Save {kind}
        </button>
      </div>
    </form>
  );
}
