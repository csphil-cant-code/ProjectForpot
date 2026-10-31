import type { AppState } from "../types";
import type { UiState } from "../stores/uiStore";
import {
  accountBalance,
  accountCount,
  budgetSummary,
  categoryBreakdown,
  monthTotals,
  totalBalance,
  transactionsInMonth,
} from "../lib/calc";
import { monthLabel } from "../utils/date";
import { percent, peso, signedPeso } from "../utils/format";
import { icon } from "../components/common/Icon";
import { cashLogo, gcashLogo } from "../components/common/Logos";
import {
  budgetTone,
  miniStat,
  monthSwitcher,
  pageHeader,
  progressBar,
} from "../components/common/ui";
import { transactionItem } from "../components/transactions";

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const balanceHero = (
  total: number,
  net: number,
  month: string,
  gcash: number,
  cash: number,
): string => `
  <section class="hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="hero__top">
      <span class="hero__label">Total money on hand</span>
      <span class="hero__badge">${icon("leaf", 14)} ${monthLabel(month)}</span>
    </div>

    <p class="hero__value">${peso(total)}</p>

    <div class="hero__meta">
      <span class="${net >= 0 ? "hero__delta is-up" : "hero__delta is-down"}">
        ${icon(net >= 0 ? "up-right" : "down-left", 15)}
        ${net >= 0 ? "+" : "−"}${peso(Math.abs(net))} this month
      </span>
    </div>

    <div class="hero__split">
      <div>
        <span class="hero__split-label">GCash</span>
        <strong>${peso(gcash)}</strong>
      </div>
      <span class="hero__split-divider" aria-hidden="true"></span>
      <div>
        <span class="hero__split-label">Cash</span>
        <strong>${peso(cash)}</strong>
      </div>
    </div>
  </section>`;

const accountCard = (
  account: "gcash" | "cash",
  balance: number,
  startingBalance: number,
  count: number,
  share: number,
): string => {
  const tone = account === "gcash" ? "blue" : "green";
  const label = account === "gcash" ? "GCash" : "Cash";

  return `
    <article class="card account-card account-card--${tone}">
      <header class="account-card__head">
        <span class="account-card__icon account-card__icon--logo">
          ${account === "gcash" ? gcashLogo(26, true) : cashLogo(26, true)}
        </span>
        <span class="account-card__name">${label}</span>
        <span class="account-card__share">${percent(share)} of total</span>
      </header>

      <p class="account-card__value">${peso(balance)}</p>

      <div class="account-card__foot">
        <span>${count} transactions</span>
        <span>started at ${peso(startingBalance)}</span>
      </div>
    </article>`;
};

const budgetWatch = (state: AppState, month: string): string => {
  const visible = categoryBreakdown(state, month)
    .filter((item) => item.budget > 0)
    .slice(0, 4);

  return `
    <section class="card card--pad">
      <div class="section__head">
        <h2 class="section__title">Budget watch</h2>
        <button type="button" class="linkish" data-action="go-budgets">Manage</button>
      </div>

      <div class="budget-list">
        ${
          visible.length === 0
            ? `<p class="muted">No budgets set yet. Add one to start watching.</p>`
            : visible
                .map(
                  ({ category, spent, budget, ratio }) => `
              <div class="budget-row">
                <div class="budget-row__top">
                  <span class="budget-row__name">
                    <span class="dot" style="background:${category.color}" aria-hidden="true"></span>
                    ${category.emoji} ${category.name}
                  </span>
                  <span class="budget-row__nums">
                    ${peso(spent)} <span class="muted">/ ${peso(budget)}</span>
                  </span>
                </div>
                ${progressBar(ratio, budgetTone(ratio), `${category.name} budget usage`)}
                <span class="budget-row__note${ratio > 1 ? " is-over" : ""}">
                  ${
                    ratio > 1
                      ? `${peso(spent - budget)} over budget`
                      : `${peso(budget - spent)} left`
                  }
                </span>
              </div>`,
                )
                .join("")
        }
      </div>
    </section>`;
};

const recentActivity = (state: AppState, month: string): string => {
  const transactions = transactionsInMonth(state, month)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .slice(0, 5);

  return `
    <section class="card card--pad">
      <div class="section__head">
        <h2 class="section__title">Recent activity</h2>
        <button type="button" class="linkish" data-action="go-transactions">View all</button>
      </div>

      ${
        transactions.length === 0
          ? `<p class="muted">Nothing logged yet this month.</p>`
          : `<ul class="tx-list">
              ${transactions
                .map((transaction) =>
                  transactionItem(
                    transaction,
                    state.categories.find(
                      (category) => category.id === transaction.categoryId,
                    ),
                  ),
                )
                .join("")}
            </ul>`
      }
    </section>`;
};

export const dashboardPage = (state: AppState, ui: UiState): string => {
  const { month } = ui;
  const totals = monthTotals(state, month);
  const budget = budgetSummary(state, month);
  const gcash = accountBalance(state, "gcash");
  const cash = accountBalance(state, "cash");
  const total = totalBalance(state);
  const share = (value: number): number =>
    total > 0 ? Math.max(0, value) / total : 0;

  return `
    ${pageHeader({
      eyebrow: greeting(),
      title: "Dashboard",
      subtitle: `Here's how your GCash and cash look in ${monthLabel(month)}.`,
      actions: monthSwitcher(month),
    })}

    <section class="dash-top">
      ${balanceHero(total, totals.net, month, gcash, cash)}
      <div class="dash-accounts">
        ${accountCard(
          "gcash",
          gcash,
          state.accounts.gcash.startingBalance,
          accountCount(state, "gcash"),
          share(gcash),
        )}
        ${accountCard(
          "cash",
          cash,
          state.accounts.cash.startingBalance,
          accountCount(state, "cash"),
          share(cash),
        )}
      </div>
    </section>

    <section class="mini-grid" aria-label="Month summary">
      ${miniStat({
        label: "Income",
        value: peso(totals.income),
        hint: "money in this month",
        iconName: "up-right",
        tone: "income",
      })}
      ${miniStat({
        label: "Spent",
        value: peso(totals.expense),
        hint: "money out this month",
        iconName: "down-left",
        tone: "expense",
      })}
      ${miniStat({
        label: "Net",
        value: signedPeso(totals.net),
        hint:
          totals.net >= 0 ? "you kept more than you spent" : "spending is ahead",
        iconName: "coins",
        tone: "net",
      })}
      ${miniStat({
        label: "Budget left",
        value: budget.budget > 0 ? peso(budget.remaining) : "No budget",
        hint:
          budget.budget > 0
            ? `${percent(budget.ratio)} of ${peso(budget.budget)} used`
            : "set limits in Budgets",
        iconName: "wallet",
        tone: "budget",
      })}
    </section>

    <section class="dash-bottom">
      ${budgetWatch(state, month)}
      ${recentActivity(state, month)}
    </section>`;
};
