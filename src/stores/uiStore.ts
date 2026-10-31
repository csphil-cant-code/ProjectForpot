import { useSyncExternalStore } from "react";
import type { AccountId, TxKind, ViewId } from "../types";
import { currentMonth } from "../utils/date";

export interface TxDraftDefaults {
  kind: TxKind;
  account: AccountId;
}

interface UiState {
  view: ViewId;
  month: string;
  addOpen: boolean;
  draft: TxDraftDefaults;
  toast: string | null;
}

let state: UiState = {
  view: "dashboard",
  month: currentMonth(),
  addOpen: false,
  draft: { kind: "expense", account: "gcash" },
  toast: null,
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
    commit({
      ...state,
      addOpen: true,
      draft: { ...state.draft, ...draft },
    });
  },

  closeAdd(): void {
    commit({ ...state, addOpen: false });
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

export const useUiState = (): UiState =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
