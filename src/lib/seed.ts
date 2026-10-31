import type { AppState, Category, Transaction } from "../types";
import { toISO } from "../utils/date";
import { uid } from "../utils/id";

const categories: Category[] = [
  {
    id: "food",
    name: "Food & dining",
    emoji: "🍚",
    color: "#bfe3c8",
    kind: "expense",
    monthlyBudget: 4000,
  },
  {
    id: "transport",
    name: "Transport",
    emoji: "🚌",
    color: "#bfdce8",
    kind: "expense",
    monthlyBudget: 1500,
  },
  {
    id: "bills",
    name: "Bills & utilities",
    emoji: "🧾",
    color: "#ecd6b8",
    kind: "expense",
    monthlyBudget: 3000,
  },
  {
    id: "shopping",
    name: "Shopping",
    emoji: "🛍️",
    color: "#e8c7dd",
    kind: "expense",
    monthlyBudget: 2000,
  },
  {
    id: "savings",
    name: "Savings",
    emoji: "🏦",
    color: "#c8dfb6",
    kind: "expense",
    monthlyBudget: 2500,
  },
  {
    id: "health",
    name: "Health",
    emoji: "💊",
    color: "#cfc6ea",
    kind: "expense",
    monthlyBudget: 1000,
  },
  {
    id: "allowance",
    name: "Allowance",
    emoji: "💰",
    color: "#bfe3c8",
    kind: "income",
    monthlyBudget: 0,
  },
  {
    id: "other-income",
    name: "Other income",
    emoji: "🎁",
    color: "#dbe8b2",
    kind: "income",
    monthlyBudget: 0,
  },
];

/**
 * Builds a sample month so the dashboard has something to show on first run.
 * Dates never land after today.
 */
const sampleTransactions = (): Transaction[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = (offset: number) => {
    const target = Math.max(1, today.getDate() - offset);
    return toISO(new Date(year, month, target));
  };

  const build = (
    values: Omit<Transaction, "id" | "createdAt" | "date"> & { offset: number },
  ): Transaction => {
    const { offset, ...rest } = values;
    return {
      ...rest,
      id: uid(),
      date: day(offset),
      createdAt: Date.now() - offset * 86_400_000,
    };
  };

  return [
    build({
      kind: "income",
      account: "gcash",
      amount: 8000,
      categoryId: "allowance",
      note: "Monthly allowance",
      offset: 9,
    }),
    build({
      kind: "income",
      account: "cash",
      amount: 650,
      categoryId: "other-income",
      note: "Sold old books",
      offset: 6,
    }),
    build({
      kind: "expense",
      account: "gcash",
      amount: 245,
      categoryId: "food",
      note: "Grabfood lunch",
      offset: 5,
    }),
    build({
      kind: "expense",
      account: "cash",
      amount: 180,
      categoryId: "food",
      note: "Palengke run",
      offset: 4,
    }),
    build({
      kind: "expense",
      account: "cash",
      amount: 60,
      categoryId: "transport",
      note: "Jeep + trike",
      offset: 3,
    }),
    build({
      kind: "expense",
      account: "gcash",
      amount: 1500,
      categoryId: "bills",
      note: "Electric bill",
      offset: 2,
    }),
    build({
      kind: "expense",
      account: "gcash",
      amount: 899,
      categoryId: "shopping",
      note: "Running shoes (sale)",
      offset: 1,
    }),
    build({
      kind: "expense",
      account: "gcash",
      amount: 100,
      categoryId: "bills",
      note: "Mobile load",
      offset: 0,
    }),
  ];
};

export const createSeedState = (): AppState => ({
  version: 2,
  accounts: {
    gcash: { id: "gcash", name: "GCash", startingBalance: 1250 },
    cash: { id: "cash", name: "Cash", startingBalance: 850 },
  },
  categories,
  transactions: sampleTransactions(),
});

export const createEmptyState = (): AppState => ({
  version: 2,
  accounts: {
    gcash: { id: "gcash", name: "GCash", startingBalance: 0 },
    cash: { id: "cash", name: "Cash", startingBalance: 0 },
  },
  categories: [],
  transactions: [],
});
