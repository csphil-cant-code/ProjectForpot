import type { Category, TxKind } from "../types";

export interface CategoryIcon {
  emoji: string;
  label: string;
}

/** Common categories a user can add with one tap. */
export interface QuickCategory {
  name: string;
  emoji: string;
  kind: TxKind;
}

/** Preset icons the user can pick from when creating a category. */
export const CATEGORY_ICONS: CategoryIcon[] = [
  { emoji: "🍚", label: "Meals" },
  { emoji: "🍔", label: "Food" },
  { emoji: "☕", label: "Coffee" },
  { emoji: "🍿", label: "Snacks" },
  { emoji: "🛒", label: "Groceries" },
  { emoji: "🏪", label: "Market" },
  { emoji: "🚌", label: "Transport" },
  { emoji: "🚗", label: "Car" },
  { emoji: "⛽", label: "Fuel" },
  { emoji: "🏠", label: "Rent" },
  { emoji: "💡", label: "Electricity" },
  { emoji: "💧", label: "Water" },
  { emoji: "🌐", label: "Internet" },
  { emoji: "📱", label: "Phone load" },
  { emoji: "🧾", label: "Bills" },
  { emoji: "🛍️", label: "Shopping" },
  { emoji: "👕", label: "Clothes" },
  { emoji: "💇", label: "Beauty" },
  { emoji: "🧺", label: "Laundry" },
  { emoji: "💊", label: "Health" },
  { emoji: "🏥", label: "Hospital" },
  { emoji: "🏋️", label: "Fitness" },
  { emoji: "📚", label: "School" },
  { emoji: "🎮", label: "Games" },
  { emoji: "📺", label: "Streaming" },
  { emoji: "🎁", label: "Gifts" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🐾", label: "Pets" },
  { emoji: "🛡️", label: "Insurance" },
  { emoji: "🏦", label: "Savings" },
  { emoji: "💰", label: "Allowance" },
  { emoji: "💵", label: "Salary" },
  { emoji: "📦", label: "Other" },
];

/**
 * The starter categories every new install begins with. Budgets start at zero
 * so the user can set their own limits on the Budgets page.
 */
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "rent",
    name: "Rent",
    emoji: "🏠",
    color: "#bfe3c8",
    kind: "expense",
    monthlyBudget: 0,
  },
  {
    id: "groceries",
    name: "Groceries",
    emoji: "🛒",
    color: "#bfdce8",
    kind: "expense",
    monthlyBudget: 0,
  },
  {
    id: "electric-bill",
    name: "Electric Bill",
    emoji: "💡",
    color: "#ecd6b8",
    kind: "expense",
    monthlyBudget: 0,
  },
  {
    id: "water-bill",
    name: "Water Bill",
    emoji: "💧",
    color: "#e8c7dd",
    kind: "expense",
    monthlyBudget: 0,
  },
  {
    id: "market",
    name: "Market",
    emoji: "🏪",
    color: "#cfc6ea",
    kind: "expense",
    monthlyBudget: 0,
  },
  {
    id: "internet",
    name: "Internet",
    emoji: "🌐",
    color: "#c8dfb6",
    kind: "expense",
    monthlyBudget: 0,
  },
];

/**
 * Ready-made categories. Kept short on purpose so the quick-add row stays
 * scannable — anything else can be created with the custom form.
 */
export const QUICK_CATEGORIES: QuickCategory[] = [
  ...DEFAULT_CATEGORIES.map(({ name, emoji, kind }) => ({ name, emoji, kind })),
  { name: "Allowance", emoji: "💰", kind: "income" },
  { name: "Salary", emoji: "💵", kind: "income" },
  { name: "Gift", emoji: "🎁", kind: "income" },
];
