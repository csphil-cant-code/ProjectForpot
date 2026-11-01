import type { AccountId, AppState, TxKind, ViewId } from "../types";
import { budgetStore } from "../stores/budgetStore";
import {
  uiStore,
  type AccountFilter,
  type KindFilter,
  type UiState,
} from "../stores/uiStore";
import { exportState } from "../lib/storage";
import { QUICK_CATEGORIES } from "../lib/categoryIcons";
import { currentMonth, shiftMonth } from "../utils/date";
import { NAV_ITEMS, appShell } from "../components/layout";
import { transactionModal } from "../components/transactions";
import { toast } from "../components/common/ui";
import { dashboardPage } from "../features/dashboard";
import { transactionsPage } from "../features/transactions";
import { budgetsPage } from "../features/budgets";
import { reportsPage } from "../features/reports";
import { settingsPage } from "../features/settings";

const PAGES: Record<
  ViewId,
  (state: AppState, ui: UiState) => string
> = {
  dashboard: dashboardPage,
  transactions: transactionsPage,
  budgets: budgetsPage,
  reports: reportsPage,
  settings: settingsPage,
};

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

let queued = false;
let focusAmountNext = false;

interface SavedFocus {
  key: string;
  start: number | null;
  end: number | null;
}

const captureFocus = (): SavedFocus | null => {
  const element = document.activeElement;
  if (!(element instanceof HTMLElement) || !root.contains(element)) return null;
  const key = element.dataset.focus;
  if (!key) return null;

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    try {
      return { key, start: element.selectionStart, end: element.selectionEnd };
    } catch {
      return { key, start: null, end: null };
    }
  }

  return { key, start: null, end: null };
};

const restoreFocus = (saved: SavedFocus | null): void => {
  if (!saved) return;
  const element = root.querySelector<HTMLElement>(
    `[data-focus="${saved.key}"]`,
  );
  if (!element) return;
  element.focus();
  if (
    (element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement) &&
    saved.start !== null &&
    saved.end !== null
  ) {
    try {
      element.setSelectionRange(saved.start, saved.end);
    } catch {
      // Number and date inputs do not support selection ranges.
    }
  }
};

const render = (): void => {
  const state = budgetStore.getSnapshot();
  const ui = uiStore.getSnapshot();
  const page = PAGES[ui.view](state, ui);
  const pageHtml = appShell(
    page,
    state,
    ui,
    `${ui.addOpen ? transactionModal(state, ui) : ""}${ui.toast ? toast(ui.toast) : ""}`,
  );
  const saved = captureFocus();

  root.innerHTML = pageHtml;
  document.body.classList.toggle("is-locked", ui.addOpen);

  if (ui.addOpen && focusAmountNext) {
    focusAmountNext = false;
    root.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return;
  }

  restoreFocus(saved);
};

const scheduleRender = (): void => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    render();
  });
};

budgetStore.subscribe(scheduleRender);
uiStore.subscribe(scheduleRender);

const viewIds = new Set<ViewId>(
  NAV_ITEMS.map((item) => item.id),
);

const parseKind = (raw: string | undefined): TxKind =>
  raw === "income" ? "income" : "expense";

const parseAccount = (raw: string | undefined): AccountId =>
  raw === "cash" ? "cash" : "gcash";

const isKindFilter = (value: string): value is KindFilter =>
  value === "all" || value === "expense" || value === "income";

const isAccountFilter = (value: string): value is AccountFilter =>
  value === "all" || value === "gcash" || value === "cash";

const importBackup = async (file: File): Promise<void> => {
  const state = budgetStore.getSnapshot();
  const hasExistingData =
    state.transactions.length > 0 ||
    state.categories.length > 0 ||
    state.accounts.gcash.startingBalance !== 0 ||
    state.accounts.cash.startingBalance !== 0;

  if (
    hasExistingData &&
    !window.confirm(
      "Importing a backup replaces everything on this device. Continue?",
    )
  ) {
    return;
  }

  const text = await file.text();
  if (!budgetStore.importBackup(text)) {
    uiStore.notify("That file isn’t a valid Pondo backup.");
    return;
  }

  const imported = budgetStore.getSnapshot();
  const latestMonth = imported.transactions[0]?.date.slice(0, 7);
  if (latestMonth) uiStore.setMonth(latestMonth);

  uiStore.notify(
    `Backup restored — ${imported.transactions.length} transactions.`,
  );
};

const handleClick = (event: MouseEvent): void => {
  const raw = event.target;
  if (!(raw instanceof Element)) return;
  const target = raw.closest<HTMLElement>("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const state = budgetStore.getSnapshot();
  const ui = uiStore.getSnapshot();

  switch (action) {
    case "nav": {
      const view = target.dataset.view as ViewId | undefined;
      if (view && viewIds.has(view)) uiStore.setView(view);
      break;
    }
    case "month-prev":
      uiStore.setMonth(shiftMonth(ui.month, -1));
      break;
    case "month-next":
      uiStore.setMonth(shiftMonth(ui.month, 1));
      break;
    case "month-reset":
      uiStore.setMonth(currentMonth());
      break;
    case "open-add":
      focusAmountNext = true;
      uiStore.openAdd();
      break;
    case "close-add":
      uiStore.closeAdd();
      break;
    case "dismiss-toast":
      uiStore.dismissToast();
      break;
    case "delete-tx": {
      const id = target.dataset.id;
      if (!id) break;
      budgetStore.deleteTransaction(id);
      uiStore.notify("Transaction deleted.");
      break;
    }
    case "delete-category": {
      const id = target.dataset.id;
      if (!id) break;
      const removed = budgetStore.deleteCategory(id);
      uiStore.notify(
        removed
          ? "Category removed."
          : "Can’t delete: transactions already use this category.",
      );
      break;
    }
    case "filter-kind": {
      const value = target.dataset.value ?? "";
      if (isKindFilter(value)) uiStore.setKindFilter(value);
      break;
    }
    case "filter-account": {
      const value = target.dataset.value ?? "";
      if (isAccountFilter(value)) uiStore.setAccountFilter(value);
      break;
    }
    case "reset-filters":
      uiStore.resetFilters();
      break;
    case "go-budgets":
      uiStore.setView("budgets");
      break;
    case "go-transactions":
      uiStore.setView("transactions");
      break;
    case "tx-kind": {
      const kind = parseKind(target.dataset.kind);
      const first = state.categories.find(
        (category) => category.kind === kind,
      );
      uiStore.patchTxForm({ kind, categoryId: first?.id ?? "", error: "" });
      break;
    }
    case "tx-account":
      uiStore.patchTxForm({ account: parseAccount(target.dataset.account) });
      break;
    case "tx-category": {
      const id = target.dataset.id;
      if (id) uiStore.patchTxForm({ categoryId: id, error: "" });
      break;
    }
    case "tx-amount": {
      const amount = target.dataset.amount;
      if (amount) uiStore.patchTxForm({ amount, error: "" });
      break;
    }
    case "tx-details":
      uiStore.patchTxForm({ detailsOpen: !ui.txForm.detailsOpen });
      break;
    case "tx-quick-create": {
      const name = target.dataset.name ?? "";
      const kind = parseKind(target.dataset.kind);
      const preset = QUICK_CATEGORIES.find(
        (category) => category.name === name && category.kind === kind,
      );
      if (!preset) break;

      const existing = state.categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      );

      if (existing) {
        if (existing.kind === kind) {
          uiStore.patchTxForm({ categoryId: existing.id, error: "" });
        } else {
          uiStore.notify(
            `“${existing.name}” is already an income or expense category.`,
          );
        }
        break;
      }

      const created = budgetStore.addCategory({
        name: preset.name,
        emoji: preset.emoji,
        monthlyBudget: 0,
        kind,
      });
      if (!created) {
        uiStore.notify("That category already exists.");
        break;
      }
      uiStore.patchTxForm({ categoryId: created.id, error: "" });
      uiStore.notify(`“${created.name}” added.`);
      break;
    }
    case "tx-goto-budgets":
      uiStore.closeAdd();
      uiStore.setView("budgets");
      break;
    case "addcat-kind":
      uiStore.patchAddCategory({ kind: parseKind(target.dataset.kind) });
      break;
    case "addcat-toggle-icons":
      uiStore.patchAddCategory({ iconsOpen: !ui.addCategory.iconsOpen });
      break;
    case "addcat-icon": {
      const emoji = target.dataset.emoji;
      if (emoji) uiStore.patchAddCategory({ emoji });
      break;
    }
    case "addcat-quick": {
      const name = target.dataset.name ?? "";
      const kind = parseKind(target.dataset.kind);
      const preset = QUICK_CATEGORIES.find(
        (category) => category.name === name && category.kind === kind,
      );
      if (!preset) break;

      const created = budgetStore.addCategory({
        name: preset.name,
        emoji: preset.emoji,
        monthlyBudget: 0,
        kind: preset.kind,
      });

      if (!created) {
        uiStore.notify(`“${preset.name}” is already in your list.`);
        break;
      }

      uiStore.notify(
        created.kind === "expense"
          ? `“${created.name}” added — set a limit on its card.`
          : `“${created.name}” added.`,
      );
      break;
    }
    case "export-data":
      exportState(state);
      uiStore.notify("Backup downloaded.");
      break;
    case "open-import":
      root.querySelector<HTMLInputElement>("[data-import-input]")?.click();
      break;
    case "load-sample":
      if (
        !window.confirm(
          "Replace everything with the sample month? Your current entries will be removed.",
        )
      ) {
        break;
      }
      budgetStore.loadSampleData();
      uiStore.notify("Sample month loaded.");
      break;
    case "clear-data":
      if (
        !window.confirm(
          "Clear all transactions and budgets? This cannot be undone.",
        )
      ) {
        break;
      }
      budgetStore.clearAllData();
      uiStore.notify("All data cleared.");
      break;
    default:
      break;
  }
};

const handleSubmit = (event: SubmitEvent): void => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.id === "tx-form") {
    event.preventDefault();
    const formState = uiStore.getSnapshot().txForm;
    const value = Number(formState.amount);

    if (!Number.isFinite(value) || value <= 0) {
      uiStore.patchTxForm({ error: "Enter an amount greater than zero." });
      return;
    }
    if (!formState.categoryId) {
      uiStore.patchTxForm({ error: "Pick a category first." });
      return;
    }

    budgetStore.addTransaction({
      kind: formState.kind,
      account: formState.account,
      amount: value,
      categoryId: formState.categoryId,
      note: formState.note.trim(),
      date: formState.date,
    });
    uiStore.notify(formState.kind === "income" ? "Income added" : "Expense added");
    uiStore.closeAdd();
    return;
  }

  if (form.id === "add-cat-form") {
    event.preventDefault();
    const formState = uiStore.getSnapshot().addCategory;
    const created = budgetStore.addCategory({
      name: formState.name,
      emoji: formState.emoji,
      monthlyBudget: Number(formState.budget) || 0,
      kind: formState.kind,
    });

    if (!created) {
      uiStore.notify("Use a unique category name.");
      return;
    }

    uiStore.notify(`“${created.name}” added.`);
    uiStore.resetAddCategory();
  }
};

const handleInput = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const field = target.dataset.field;

  switch (field) {
    case "search":
      uiStore.setSearch(target.value);
      break;
    case "tx-amount":
      uiStore.patchTxForm({ amount: target.value, error: "" }, false);
      break;
    case "tx-date":
      uiStore.patchTxForm({ date: target.value }, false);
      break;
    case "tx-note":
      uiStore.patchTxForm({ note: target.value }, false);
      break;
    case "addcat-name":
      uiStore.patchAddCategory({ name: target.value }, false);
      updateAddCategorySubmit(target.value);
      break;
    case "addcat-budget":
      uiStore.patchAddCategory({ budget: target.value }, false);
      break;
    default:
      if (target.hasAttribute("data-budget-input")) {
        const id = target.dataset.id;
        if (id) uiStore.setBudgetDraft(id, target.value);
      }
      break;
  }
};

const updateAddCategorySubmit = (name: string): void => {
  const button = root.querySelector<HTMLButtonElement>(
    "#add-cat-form .add-cat__submit",
  );
  if (button) button.disabled = !name.trim();
};

const handleFocusOut = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.hasAttribute("data-budget-input")) {
    const id = target.dataset.id;
    if (!id) return;
    const value = Number(target.value);
    uiStore.clearBudgetDraft(id);
    if (Number.isFinite(value) && value >= 0) {
      budgetStore.setBudget(id, value);
    }
    return;
  }

  if (target.hasAttribute("data-balance-input")) {
    const account = target.dataset.account;
    if (account !== "gcash" && account !== "cash") return;
    const value = Number(target.value);
    if (!Number.isFinite(value)) return;
    budgetStore.setStartingBalance(account, value);
    uiStore.notify("Starting balance saved.");
  }
};

const handleChange = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.hasAttribute("data-import-input")) return;

  const file = target.files?.[0];
  target.value = "";
  if (file) void importBackup(file);
};

const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === "Escape" && uiStore.getSnapshot().addOpen) {
    uiStore.closeAdd();
    return;
  }

  if (
    event.key === "Enter" &&
    event.target instanceof HTMLInputElement &&
    event.target.hasAttribute("data-budget-input")
  ) {
    event.target.blur();
  }
};

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("input", handleInput);
document.addEventListener("focusout", handleFocusOut);
document.addEventListener("change", handleChange);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("mousedown", (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.classList.contains("modal")) uiStore.closeAdd();
});

render();
