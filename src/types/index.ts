export type AccountId = "gcash" | "cash";

export type TxKind = "expense" | "income";

export type ViewId = "dashboard" | "transactions" | "budgets" | "reports" | "settings";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  /** Pastel accent used for badges and charts. */
  color: string;
  kind: TxKind;
  /** Monthly limit in pesos. `0` means "no budget set". */
  monthlyBudget: number;
}

export interface Account {
  id: AccountId;
  name: string;
  /** Money already on hand before this app started tracking. */
  startingBalance: number;
}

export interface Transaction {
  id: string;
  kind: TxKind;
  account: AccountId;
  amount: number;
  categoryId: string;
  note: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  createdAt: number;
}

export interface AppState {
  version: 2;
  accounts: Record<AccountId, Account>;
  categories: Category[];
  transactions: Transaction[];
}

export interface MonthTotals {
  income: number;
  expense: number;
  net: number;
}

export interface CategorySpend {
  category: Category;
  spent: number;
  budget: number;
  ratio: number;
  remaining: number;
}

export interface MonthPoint {
  month: string;
  income: number;
  expense: number;
}
