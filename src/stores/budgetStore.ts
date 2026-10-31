import { useSyncExternalStore } from "react";
import type { AccountId, AppState, Category, Transaction, TxKind } from "../types";
import {
  dropLegacyState,
  initialState,
  parseBackup,
  saveState,
} from "../lib/storage";
import { createEmptyState, createSeedState } from "../lib/seed";
import { uid } from "../utils/id";

let state: AppState = initialState();
dropLegacyState();
const listeners = new Set<() => void>();

const commit = (next: AppState): void => {
  state = next;
  saveState(state);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): AppState => state;

export type NewTransaction = Omit<Transaction, "id" | "createdAt">;

export type NewCategory = {
  name: string;
  emoji: string;
  monthlyBudget: number;
  kind: TxKind;
};

export const budgetStore = {
  subscribe,
  getSnapshot,

  addTransaction(input: NewTransaction): void {
    if (!Number.isFinite(input.amount) || input.amount <= 0) return;
    const transaction: Transaction = {
      ...input,
      amount: Math.round(input.amount * 100) / 100,
      id: uid(),
      createdAt: Date.now(),
    };
    commit({ ...state, transactions: [transaction, ...state.transactions] });
  },

  deleteTransaction(id: string): void {
    commit({
      ...state,
      transactions: state.transactions.filter((item) => item.id !== id),
    });
  },

  setBudget(categoryId: string, monthlyBudget: number): void {
    const safeBudget = Number.isFinite(monthlyBudget)
      ? Math.max(0, Math.round(monthlyBudget))
      : 0;
    commit({
      ...state,
      categories: state.categories.map((category) =>
        category.id === categoryId
          ? { ...category, monthlyBudget: safeBudget }
          : category,
      ),
    });
  },

  addCategory(input: NewCategory): Category | null {
    const name = input.name.trim();
    if (!name) return null;
    const duplicated = state.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicated) return null;

    const palette = [
      "#bfe3c8",
      "#bfdce8",
      "#ecd6b8",
      "#e8c7dd",
      "#cfc6ea",
      "#c8dfb6",
    ];
    const category: Category = {
      id: uid(),
      name,
      emoji: input.emoji.trim() || "🌿",
      color: palette[state.categories.length % palette.length],
      kind: input.kind,
      monthlyBudget:
        input.kind === "expense"
          ? Math.max(0, Math.round(input.monthlyBudget || 0))
          : 0,
    };
    commit({ ...state, categories: [...state.categories, category] });
    return category;
  },

  /** Categories referenced by transactions are kept to avoid orphaning data. */
  deleteCategory(categoryId: string): boolean {
    const inUse = state.transactions.some(
      (transaction) => transaction.categoryId === categoryId,
    );
    if (inUse) return false;
    commit({
      ...state,
      categories: state.categories.filter(
        (category) => category.id !== categoryId,
      ),
    });
    return true;
  },

  setStartingBalance(accountId: AccountId, value: number): void {
    const safeValue = Number.isFinite(value)
      ? Math.round(value * 100) / 100
      : 0;
    commit({
      ...state,
      accounts: {
        ...state.accounts,
        [accountId]: {
          ...state.accounts[accountId],
          startingBalance: safeValue,
        },
      },
    });
  },

  loadSampleData(): void {
    commit(createSeedState());
  },

  /** Replaces everything with a validated backup. Returns `false` if invalid. */
  importBackup(raw: string): boolean {
    const next = parseBackup(raw);
    if (!next) return false;
    commit(next);
    return true;
  },

  clearAllData(): void {
    commit(createEmptyState());
  },
};

export const useAppState = (): AppState =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
