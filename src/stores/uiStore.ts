import type { AccountId, TxKind, ViewId } from "../types";
import { currentMonth, todayISO } from "../utils/date";
import { budgetStore } from "./budgetStore";

export interface TxDraftDefaults {
  kind: TxKind;
  account: AccountId;
}

export type KindFilter = "all" | TxKind;
export type AccountFilter = "all" | AccountId;

export interface TxFormState {
  kind: TxKind;
  account: AccountId;
  amount: string;
  categoryId: string;
  date: string;
  note: string;
  detailsOpen: boolean;
  error: string;
}

export interface AddCategoryState {
  kind: TxKind;
  name: string;
  emoji: string;
  budget: string;
  iconsOpen: boolean;
}

export interface UiState {
  view: ViewId;
  month: string;
  addOpen: boolean;
  draft: TxDraftDefaults;
  toast: string | null;
  search: string;
  kindFilter: KindFilter;
  accountFilter: AccountFilter;
  txForm: TxFormState;
  addCategory: AddCategoryState;
  /** Keeps half-typed budget values alive across re-renders. */
  budgetDrafts: Record<string, string>;
}

const emptyForm = (
  kind: TxKind,
  account: AccountId,
  categoryId: string,
): TxFormState => ({
  kind,
  account,
  amount: "",
  categoryId,
  date: todayISO(),
  note: "",
  detailsOpen: false,
  error: "",
});

const initialCategory = (kind: TxKind): string =>
  budgetStore
    .getSnapshot()
    .categories.find((category) => category.kind === kind)?.id ?? "";

let state: UiState = {
  view: "dashboard",
  month: currentMonth(),
  addOpen: false,
  draft: { kind: "expense", account: "gcash" },
  toast: null,
  search: "",
  kindFilter: "all",
  accountFilter: "all",
  txForm: emptyForm("expense", "gcash", initialCategory("expense")),
  addCategory: {
    kind: "expense",
    name: "",
    emoji: "🍚",
    budget: "",
    iconsOpen: false,
  },
  budgetDrafts: {},
};

const listeners = new Set<() => void>();
let toastTimer: ReturnType<typeof setTimeout> | undefined;

const commit = (next: UiState): void => {
  state = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): UiState => state;

export const uiStore = {
  subscribe,
  getSnapshot,

  setView(view: ViewId): void {
    commit({ ...state, view });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  setMonth(month: string): void {
    commit({ ...state, month });
  },

  openAdd(draft?: Partial<TxDraftDefaults>): void {
    const next = { ...state.draft, ...draft };
    commit({
      ...state,
      addOpen: true,
      draft: next,
      txForm: emptyForm(next.kind, next.account, initialCategory(next.kind)),
    });
  },

  closeAdd(): void {
    commit({ ...state, addOpen: false });
  },

  /** Text fields update silently; selection changes re-render the modal. */
  patchTxForm(patch: Partial<TxFormState>, rerender = true): void {
    const next = { ...state.txForm, ...patch };
    if (rerender) {
      commit({ ...state, txForm: next });
    } else {
      state = { ...state, txForm: next };
    }
  },

  patchAddCategory(patch: Partial<AddCategoryState>, rerender = true): void {
    const next = { ...state.addCategory, ...patch };
    if (rerender) {
      commit({ ...state, addCategory: next });
    } else {
      state = { ...state, addCategory: next };
    }
  },

  resetAddCategory(): void {
    commit({
      ...state,
      addCategory: {
        kind: "expense",
        name: "",
        emoji: "🍚",
        budget: "",
        iconsOpen: false,
      },
    });
  },

  setSearch(search: string): void {
    commit({ ...state, search });
  },

  setKindFilter(kindFilter: KindFilter): void {
    commit({ ...state, kindFilter });
  },

  setAccountFilter(accountFilter: AccountFilter): void {
    commit({ ...state, accountFilter });
  },

  resetFilters(): void {
    commit({ ...state, search: "", kindFilter: "all", accountFilter: "all" });
  },

  setBudgetDraft(categoryId: string, value: string): void {
    state = {
      ...state,
      budgetDrafts: { ...state.budgetDrafts, [categoryId]: value },
    };
  },

  clearBudgetDraft(categoryId: string): void {
    const next = { ...state.budgetDrafts };
    delete next[categoryId];
    commit({ ...state, budgetDrafts: next });
  },

  notify(message: string): void {
    if (toastTimer) clearTimeout(toastTimer);
    commit({ ...state, toast: message });
    toastTimer = setTimeout(() => {
      commit({ ...state, toast: null });
    }, 2600);
  },

  dismissToast(): void {
    if (toastTimer) clearTimeout(toastTimer);
    commit({ ...state, toast: null });
  },
};
