import type { AppState } from "../types";
import type { UiState } from "../stores/uiStore";
import { transactionList } from "../components/transactions";
import { emptyState, monthSwitcher, pageHeader } from "../components/common/ui";
import { icon } from "../components/common/Icon";
import { transactionsInMonth } from "../lib/calc";
import { monthLabel } from "../utils/date";
import { peso } from "../utils/format";
import { escapeHtml } from "../utils/html";

export const transactionsPage = (state: AppState, ui: UiState): string => {
  const { month, search, kindFilter, accountFilter } = ui;
  const needle = search.trim().toLowerCase();

  const transactions = transactionsInMonth(state, month)
    .filter(
      (transaction) =>
        kindFilter === "all" || transaction.kind === kindFilter,
    )
    .filter(
      (transaction) =>
        accountFilter === "all" || transaction.account === accountFilter,
    )
    .filter((transaction) => {
      if (!needle) return true;
      const category =
        state.categories.find((item) => item.id === transaction.categoryId)
          ?.name ?? "";
      return `${transaction.note} ${category}`.toLowerCase().includes(needle);
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.kind === "income") acc.income += transaction.amount;
      else acc.expense += transaction.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const hasFilters =
    search.trim() !== "" || kindFilter !== "all" || accountFilter !== "all";

  const filterButton = (
    group: "kind" | "account",
    value: string,
    label: string,
    active: boolean,
  ): string => `<button
    type="button"
    class="toggle-group__btn${active ? " is-active" : ""}"
    data-action="filter-${group}"
    data-value="${value}"
  >${label}</button>`;

  return `
    ${pageHeader({
      eyebrow: monthLabel(month),
      title: "Transactions",
      subtitle: "Every peso in and out, tracked by wallet.",
      actions: `
        ${monthSwitcher(month)}
        <button type="button" class="btn btn--primary" data-action="open-add">
          ${icon("plus", 17)} Add
        </button>`,
    })}

    <section class="card card--pad filters">
      <label class="search">
        ${icon("search", 17)}
        <input
          type="search"
          placeholder="Search notes or categories"
          value="${escapeHtml(search)}"
          data-field="search"
          data-focus="search"
          aria-label="Search transactions"
        />
      </label>

      <div class="filters__row">
        <div class="toggle-group toggle-group--sm" role="group" aria-label="Filter by type">
          ${filterButton("kind", "all", "All", kindFilter === "all")}
          ${filterButton("kind", "expense", "Expenses", kindFilter === "expense")}
          ${filterButton("kind", "income", "Income", kindFilter === "income")}
        </div>

        <div class="toggle-group toggle-group--sm" role="group" aria-label="Filter by wallet">
          ${filterButton("account", "all", "Both", accountFilter === "all")}
          ${filterButton("account", "gcash", "GCash", accountFilter === "gcash")}
          ${filterButton("account", "cash", "Cash", accountFilter === "cash")}
        </div>

        ${
          hasFilters
            ? `<button type="button" class="linkish" data-action="reset-filters">Clear filters</button>`
            : ""
        }
      </div>

      <div class="filters__totals">
        <span>${transactions.length} ${transactions.length === 1 ? "record" : "records"}</span>
        <span class="text-income">+${peso(totals.income)}</span>
        <span class="text-expense">−${peso(totals.expense)}</span>
      </div>
    </section>

    ${
      transactions.length === 0
        ? emptyState({
            emoji: "🧾",
            title: hasFilters ? "No matches" : "No transactions yet",
            description: hasFilters
              ? "Try a different keyword or clear the filters."
              : "Add your first GCash or cash entry to start monitoring your budget.",
            action: hasFilters
              ? `<button type="button" class="btn btn--soft" data-action="reset-filters">Clear filters</button>`
              : `<button type="button" class="btn btn--primary" data-action="open-add">${icon("plus", 17)} Add transaction</button>`,
          })
        : transactionList(state, transactions)
    }`;
};
