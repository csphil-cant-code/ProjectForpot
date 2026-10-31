import type { TxKind } from "../types";

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
 * Ready-made categories. Kept short on purpose so the quick-add row stays
 * scannable — anything else can be created with the custom form.
 */
export const QUICK_CATEGORIES: QuickCategory[] = [
  { name: "Food", emoji: "🍚", kind: "expense" },
  { name: "Transport", emoji: "🚌", kind: "expense" },
  { name: "Bills", emoji: "🧾", kind: "expense" },
  { name: "Shopping", emoji: "🛍️", kind: "expense" },
  { name: "Health", emoji: "💊", kind: "expense" },
  { name: "Load", emoji: "📱", kind: "expense" },
  { name: "Allowance", emoji: "💰", kind: "income" },
  { name: "Salary", emoji: "💵", kind: "income" },
  { name: "Gift", emoji: "🎁", kind: "income" },
];
