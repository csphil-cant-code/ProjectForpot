import type {
  Account,
  AccountId,
  AppState,
  Category,
  Transaction,
  TxKind,
} from "../types";
import { toISO } from "../utils/date";
import { createDefaultState } from "./seed";

const STORAGE_KEY = "pondo.state.v2";
const LEGACY_KEYS = ["pondo.state.v1"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const round2 = (value: number): number => Math.round(value * 100) / 100;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isAccountId = (value: unknown): value is AccountId =>
  value === "gcash" || value === "cash";

const isTxKind = (value: unknown): value is TxKind =>
  value === "expense" || value === "income";

const isIsoDate = (value: unknown): value is string => {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const parsed = new Date(
    Number(value.slice(0, 4)),
    Number(value.slice(5, 7)) - 1,
    Number(value.slice(8, 10)),
  );
  return !Number.isNaN(parsed.getTime()) && toISO(parsed) === value;
};

const normalizeAccount = (raw: unknown, id: AccountId): Account | null => {
  if (!isRecord(raw) || !isFiniteNumber(raw.startingBalance)) return null;
  const name =
    typeof raw.name === "string" && raw.name.trim()
      ? raw.name.trim()
      : id === "gcash"
        ? "GCash"
        : "Cash";
  return { id, name, startingBalance: round2(raw.startingBalance) };
};

const normalizeCategory = (raw: unknown): Category | null => {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== "string" || !raw.id.trim()) return null;
  if (typeof raw.name !== "string" || !raw.name.trim()) return null;
  if (!isTxKind(raw.kind)) return null;
  if (!isFiniteNumber(raw.monthlyBudget)) return null;

  return {
    id: raw.id,
    name: raw.name.trim(),
    emoji:
      typeof raw.emoji === "string" && raw.emoji.trim() ? raw.emoji : "🌿",
    color:
      typeof raw.color === "string" && raw.color.trim()
        ? raw.color
        : "#bfe3c8",
    kind: raw.kind,
    monthlyBudget:
      raw.kind === "expense" ? Math.max(0, Math.round(raw.monthlyBudget)) : 0,
  };
};

const normalizeTransaction = (raw: unknown): Transaction | null => {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== "string" || !raw.id.trim()) return null;
  if (!isTxKind(raw.kind)) return null;
  if (!isAccountId(raw.account)) return null;
  if (!isFiniteNumber(raw.amount) || raw.amount <= 0) return null;
  if (typeof raw.categoryId !== "string" || !raw.categoryId.trim()) return null;
  if (!isIsoDate(raw.date)) return null;
  if (!isFiniteNumber(raw.createdAt)) return null;

  return {
    id: raw.id,
    kind: raw.kind,
    account: raw.account,
    amount: round2(raw.amount),
    categoryId: raw.categoryId,
    note: typeof raw.note === "string" ? raw.note : "",
    date: raw.date,
    createdAt: raw.createdAt,
  };
};

/**
 * Rebuilds a trusted app state from untrusted JSON (localStorage or an
 * imported backup). Returns `null` when the shape isn't recognizable so the
 * caller can decide between falling back to a clean slate and warning the user.
 */
export const normalizeState = (value: unknown): AppState | null => {
  if (!isRecord(value) || !isRecord(value.accounts)) return null;
  const gcash = normalizeAccount(value.accounts.gcash, "gcash");
  const cash = normalizeAccount(value.accounts.cash, "cash");
  if (!gcash || !cash) return null;
  if (!Array.isArray(value.categories) || !Array.isArray(value.transactions)) {
    return null;
  }

  const categoryIds = new Set<string>();
  const categories: Category[] = [];
  for (const entry of value.categories) {
    const category = normalizeCategory(entry);
    if (!category || categoryIds.has(category.id)) return null;
    categoryIds.add(category.id);
    categories.push(category);
  }

  const transactionIds = new Set<string>();
  const transactions: Transaction[] = [];
  for (const entry of value.transactions) {
    const transaction = normalizeTransaction(entry);
    if (!transaction || transactionIds.has(transaction.id)) return null;
    transactionIds.add(transaction.id);
    transactions.push(transaction);
  }

  return {
    version: 2,
    accounts: { gcash, cash },
    categories,
    transactions: transactions.sort((a, b) => b.createdAt - a.createdAt),
  };
};

export const parseBackup = (raw: string): AppState | null => {
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const loadState = (): AppState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveState = (state: AppState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode, quota). The app still works
    // for the session; we simply skip persistence.
  }
};

/** A brand-new install starts with the six starter categories and zero balances. */
export const initialState = (): AppState => loadState() ?? createDefaultState();

/** Old sample-data saves are only removed once a new state exists. */
export const dropLegacyState = (): void => {
  try {
    LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
};

export const exportState = (state: AppState): void => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `pondo-backup-${stamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
