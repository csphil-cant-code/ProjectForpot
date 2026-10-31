import type { AppState, Category, Transaction } from "../types";
import type { UiState } from "../stores/uiStore";
import { ACCOUNT_LABEL, KIND_LABEL } from "../lib/labels";
import { QUICK_CATEGORIES } from "../lib/categoryIcons";
import { accountBalance } from "../lib/calc";
import { peso } from "../utils/format";
import { relativeDay, todayISO } from "../utils/date";
import { escapeHtml } from "../utils/html";
import { icon } from "./common/Icon";
import { cashLogo, gcashLogo } from "./common/Logos";

export const transactionItem = (
  transaction: Transaction,
  category: Category | undefined,
  showDelete = false,
): string => {
  const sign = transaction.kind === "income" ? "+" : "−";
  const name = category?.name ?? "Uncategorized";
  const note = transaction.note || "No note";

  return `
    <li class="tx">
      <span
        class="tx__badge"
        style="background:${category?.color ?? "#e6f0e9"}"
        aria-hidden="true"
      >${category?.emoji ?? "•"}</span>

      <div class="tx__main">
        <span class="tx__title">${escapeHtml(name)}</span>
        <span class="tx__meta">${escapeHtml(note)} · ${ACCOUNT_LABEL[transaction.account]}</span>
      </div>

      <div class="tx__side">
        <span class="tx__amount tx__amount--${transaction.kind}">
          ${sign}${peso(transaction.amount)}
        </span>
        <span class="tx__date">${relativeDay(transaction.date)}</span>
      </div>

      ${
        showDelete
          ? `<button
              type="button"
              class="tx__del"
              data-action="delete-tx"
              data-id="${escapeHtml(transaction.id)}"
              aria-label="Delete ${escapeHtml(name)} on ${transaction.date}"
            >${icon("trash", 16)}</button>`
          : ""
      }
    </li>`;
};

interface Group {
  date: string;
  items: Transaction[];
  expense: number;
  income: number;
}

const groupByDate = (transactions: Transaction[]): Group[] => {
  const map = new Map<string, Group>();
  transactions.forEach((transaction) => {
    const group = map.get(transaction.date) ?? {
      date: transaction.date,
      items: [],
      expense: 0,
      income: 0,
    };
    group.items.push(transaction);
    if (transaction.kind === "expense") group.expense += transaction.amount;
    else group.income += transaction.amount;
    map.set(transaction.date, group);
  });

  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
};

export const transactionList = (
  state: AppState,
  transactions: Transaction[],
  withDelete = true,
): string => {
  const groups = groupByDate(transactions);

  return `
    <div class="tx-groups">
      ${groups
        .map(
          (group) => `
        <section class="tx-group">
          <header class="tx-group__head">
            <h3 class="tx-group__date">${relativeDay(group.date)}</h3>
            <p class="tx-group__sums">
              ${group.income > 0 ? `<span class="text-income">+${peso(group.income)}</span>` : ""}
              ${group.expense > 0 ? `<span class="text-expense">−${peso(group.expense)}</span>` : ""}
            </p>
          </header>
          <ul class="tx-list">
            ${group.items
              .map((transaction) =>
                transactionItem(
                  transaction,
                  state.categories.find(
                    (category) => category.id === transaction.categoryId,
                  ),
                  withDelete,
                ),
              )
              .join("")}
          </ul>
        </section>`,
        )
        .join("")}
    </div>`;
};

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

const transactionForm = (state: AppState, ui: UiState): string => {
  const form = ui.txForm;
  const categories = state.categories.filter(
    (category) => category.kind === form.kind,
  );
  const suggestions = QUICK_CATEGORIES.filter(
    (category) => category.kind === form.kind,
  );

  return `
    <form class="tx-form" id="tx-form">
      <div class="toggle-group tx-kind" role="group" aria-label="Type">
        <button
          type="button"
          class="toggle-group__btn${form.kind === "expense" ? " is-active" : ""}"
          data-action="tx-kind"
          data-kind="expense"
          aria-pressed="${form.kind === "expense"}"
        >${icon("down-left", 16)} Expense</button>
        <button
          type="button"
          class="toggle-group__btn${form.kind === "income" ? " is-active" : ""}"
          data-action="tx-kind"
          data-kind="income"
          aria-pressed="${form.kind === "income"}"
        >${icon("up-right", 16)} Income</button>
      </div>

      <div class="amount-block">
        <span class="field__label" id="tx-amount-label">How much?</span>
        <div class="amount-field">
          <span class="amount-field__currency">₱</span>
          <input
            class="amount-field__input"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value="${escapeHtml(form.amount)}"
            data-field="tx-amount"
            data-focus="tx-amount"
            data-autofocus
            aria-labelledby="tx-amount-label"
          />
        </div>

        <div class="quick-amounts" aria-label="Quick amounts">
          ${QUICK_AMOUNTS.map(
            (value) => `<button
              type="button"
              class="quick-amounts__chip"
              data-action="tx-amount"
              data-amount="${value}"
            >₱${value}</button>`,
          ).join("")}
        </div>
      </div>

      <fieldset class="field">
        <legend class="field__label">
          ${form.kind === "expense" ? "What was it for?" : "Where did it come from?"}
        </legend>

        ${
          categories.length > 0
            ? `<div class="cat-grid">
                ${categories
                  .map((category) => {
                    const active = form.categoryId === category.id;
                    return `<button
                      type="button"
                      class="cat-tile${active ? " is-active" : ""}"
                      data-action="tx-category"
                      data-id="${escapeHtml(category.id)}"
                      aria-pressed="${active}"
                    >
                      <span
                        class="cat-tile__emoji"
                        style="background:${category.color}"
                        aria-hidden="true"
                      >${category.emoji}</span>
                      <span class="cat-tile__name">${escapeHtml(category.name)}</span>
                      ${active ? icon("check", 15, "cat-tile__check") : ""}
                    </button>`;
                  })
                  .join("")}
              </div>`
            : `<div class="tx-empty">
                <div class="tx-empty__head">
                  <span class="tx-empty__emoji" aria-hidden="true">🌱</span>
                  <div>
                    <strong>No ${KIND_LABEL[form.kind].toLowerCase()} categories yet</strong>
                    <p>Pick a suggestion to create one instantly.</p>
                  </div>
                </div>

                <div class="tx-empty__presets">
                  ${suggestions
                    .map(
                      (preset) => `<button
                        type="button"
                        class="quick-cat quick-cat--sm"
                        data-action="tx-quick-create"
                        data-name="${escapeHtml(preset.name)}"
                        data-kind="${preset.kind}"
                      >
                        <span aria-hidden="true">${preset.emoji}</span>
                        ${escapeHtml(preset.name)} ${icon("plus", 13)}
                      </button>`,
                    )
                    .join("")}
                </div>

                <button type="button" class="linkish" data-action="tx-goto-budgets">
                  Or create your own category
                </button>
              </div>`
        }
      </fieldset>

      <fieldset class="field">
        <legend class="field__label">Paid with</legend>
        <div class="account-picker">
          ${(["gcash", "cash"] as const)
            .map((id) => {
              const active = form.account === id;
              return `<button
                type="button"
                class="account-picker__btn${active ? " is-active" : ""}"
                data-action="tx-account"
                data-account="${id}"
                aria-pressed="${active}"
              >
                <span class="account-picker__logo">
                  ${id === "gcash" ? gcashLogo(22, true) : cashLogo(22, true)}
                </span>
                <span class="account-picker__text">
                  <strong>${ACCOUNT_LABEL[id]}</strong>
                  <span>${peso(accountBalance(state, id))}</span>
                </span>
                ${active ? icon("check", 15, "account-picker__check") : ""}
              </button>`;
            })
            .join("")}
        </div>
      </fieldset>

      <button
        type="button"
        class="tx-details${form.detailsOpen ? " is-open" : ""}"
        data-action="tx-details"
        aria-expanded="${form.detailsOpen}"
        aria-controls="tx-details-panel"
      >
        <span class="tx-details__title">
          ${icon("chevron-right", 15, "tx-details__chevron")}
          Date &amp; note <span class="muted">(optional)</span>
        </span>
        <span class="tx-details__meta">${relativeDay(form.date)}</span>
      </button>

      ${
        form.detailsOpen
          ? `<div class="form-row" id="tx-details-panel">
              <label class="field">
                <span class="field__label">Date</span>
                <input
                  class="input"
                  type="date"
                  value="${escapeHtml(form.date)}"
                  max="${todayISO()}"
                  data-field="tx-date"
                  data-focus="tx-date"
                />
              </label>
              <label class="field">
                <span class="field__label">Note</span>
                <input
                  class="input"
                  type="text"
                  placeholder="e.g. Lunch with friends"
                  value="${escapeHtml(form.note)}"
                  maxlength="80"
                  data-field="tx-note"
                  data-focus="tx-note"
                />
              </label>
            </div>`
          : ""
      }

      ${
        form.error
          ? `<p class="form-error" role="alert">${icon("alert", 15)}${escapeHtml(form.error)}</p>`
          : ""
      }

      <div class="form-actions">
        <button type="button" class="btn btn--ghost" data-action="close-add">Cancel</button>
        <button
          type="submit"
          class="btn btn--primary"
          ${categories.length === 0 ? "disabled" : ""}
        >${icon("check", 17)} Save ${form.kind}</button>
      </div>
    </form>`;
};

export const transactionModal = (state: AppState, ui: UiState): string => `
  <div class="modal" data-modal>
    <div
      class="modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
    >
      <header class="modal__head">
        <div>
          <h2 class="modal__title" id="tx-modal-title">New transaction</h2>
          <p class="modal__sub">Amount, category, account — that&#39;s it.</p>
        </div>
        <button
          type="button"
          class="icon-btn"
          data-action="close-add"
          aria-label="Close"
        >${icon("close", 18)}</button>
      </header>

      ${transactionForm(state, ui)}
    </div>
  </div>`;
