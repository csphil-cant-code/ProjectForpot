import type { AccountId, TxKind } from "../types";

export const ACCOUNT_LABEL: Record<AccountId, string> = {
  gcash: "GCash",
  cash: "Cash",
};

export const KIND_LABEL: Record<TxKind, string> = {
  expense: "Expense",
  income: "Income",
};
