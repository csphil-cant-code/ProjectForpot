import type {
  AccountId,
  AppState,
  Category,
  CategorySpend,
  MonthPoint,
  MonthTotals,
  Transaction,
} from "../types";
import { monthOf, previousMonths } from "../utils/date";

export const transactionsInMonth = (
  state: AppState,
  month: string,
): Transaction[] =>
  state.transactions.filter((transaction) => monthOf(transaction.date) === month);

export const accountBalance = (
  state: AppState,
  accountId: AccountId,
): number =>
  state.transactions.reduce((balance, transaction) => {
    if (transaction.account !== accountId) return balance;
    return transaction.kind === "income"
      ? balance + transaction.amount
      : balance - transaction.amount;
  }, state.accounts[accountId].startingBalance);

export const totalBalance = (state: AppState): number =>
  accountBalance(state, "gcash") + accountBalance(state, "cash");

export const monthTotals = (state: AppState, month: string): MonthTotals => {
  const totals = transactionsInMonth(state, month).reduce(
    (acc, transaction) => {
      if (transaction.kind === "income") acc.income += transaction.amount;
      else acc.expense += transaction.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  return { ...totals, net: totals.income - totals.expense };
};

export const findCategory = (
  state: AppState,
  categoryId: string,
): Category | undefined =>
  state.categories.find((category) => category.id === categoryId);

export const categorySpent = (
  state: AppState,
  month: string,
  categoryId: string,
): number =>
  state.transactions.reduce((total, transaction) => {
    if (
      transaction.kind !== "expense" ||
      transaction.categoryId !== categoryId ||
      monthOf(transaction.date) !== month
    ) {
      return total;
    }
    return total + transaction.amount;
  }, 0);

export const categoryBreakdown = (
  state: AppState,
  month: string,
): CategorySpend[] =>
  state.categories
    .filter((category) => category.kind === "expense")
    .map((category) => {
      const spent = categorySpent(state, month, category.id);
      const budget = category.monthlyBudget;
      return {
        category,
        spent,
        budget,
        ratio: budget > 0 ? spent / budget : spent > 0 ? 1 : 0,
        remaining: budget - spent,
      };
    })
    .sort((a, b) => b.spent - a.spent);

export const monthlySeries = (
  state: AppState,
  endMonth: string,
  count: number,
): MonthPoint[] =>
  previousMonths(endMonth, count).map((month) => {
    const totals = monthTotals(state, month);
    return { month, income: totals.income, expense: totals.expense };
  });

export const budgetSummary = (
  state: AppState,
  month: string,
): { budget: number; spent: number; remaining: number; ratio: number } => {
  const budgetCategories = state.categories.filter(
    (category) => category.kind === "expense",
  );
  const budget = budgetCategories.reduce(
    (total, category) => total + category.monthlyBudget,
    0,
  );
  const spent = budgetCategories.reduce(
    (total, category) => total + categorySpent(state, month, category.id),
    0,
  );
  return {
    budget,
    spent,
    remaining: budget - spent,
    ratio: budget > 0 ? spent / budget : 0,
  };
};

export const accountCount = (state: AppState, accountId: AccountId): number =>
  state.transactions.filter((transaction) => transaction.account === accountId)
    .length;
