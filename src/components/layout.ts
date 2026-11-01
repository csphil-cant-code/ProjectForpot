import type { AppState, ViewId } from "../types";
import type { UiState } from "../stores/uiStore";
import { totalBalance } from "../lib/calc";
import { peso } from "../utils/format";
import { icon, type IconName } from "./common/Icon";
import { pondoMark } from "./common/Logos";

interface NavItem {
  id: ViewId;
  label: string;
  shortLabel: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: "home" },
  {
    id: "transactions",
    label: "Transactions",
    shortLabel: "Activity",
    icon: "list",
  },
  { id: "budgets", label: "Budgets", shortLabel: "Budgets", icon: "wallet" },
  { id: "reports", label: "Reports", shortLabel: "Reports", icon: "chart" },
  {
    id: "settings",
    label: "Settings",
    shortLabel: "Settings",
    icon: "settings",
  },
];

const sidebar = (state: AppState, view: ViewId): string => `
  <aside class="sidebar">
    <div class="brand">
      <span class="brand__mark">${pondoMark(42)}</span>
      <span class="brand__text">
        <strong>Pondo</strong>
        <small>Budget ni Pot</small>
      </span>
    </div>

    <nav class="nav" aria-label="Main">
      ${NAV_ITEMS.map(
        (item) => `<button
          type="button"
          class="nav__item${view === item.id ? " is-active" : ""}"
          data-action="nav"
          data-view="${item.id}"
          ${view === item.id ? 'aria-current="page"' : ""}
        >${icon(item.icon, 19)}<span>${item.label}</span></button>`,
      ).join("")}
    </nav>

    <div class="sidebar__card">
      <span class="sidebar__card-label">Total balance</span>
      <strong class="sidebar__card-value">${peso(totalBalance(state))}</strong>
      <span class="sidebar__card-hint">GCash + cash on hand</span>
      <button
        type="button"
        class="btn btn--soft btn--sm sidebar__card-btn"
        data-action="open-add"
      >${icon("plus", 15)} Add transaction</button>
    </div>

    <p class="sidebar__footer">Your data stays on this device.</p>
  </aside>`;

const mobileBrand = (): string => `
  <div class="mobile-brand">
    <span class="mobile-brand__mark">${pondoMark(34)}</span>
    <span class="mobile-brand__text">
      <strong>Pondo</strong>
      <small>Budget ni Pot</small>
    </span>
  </div>`;

const mobileNav = (view: ViewId): string => `
  <nav class="bottom-nav" aria-label="Main">
    ${NAV_ITEMS.map(
      (item) => `<button
        type="button"
        class="bottom-nav__item${view === item.id ? " is-active" : ""}"
        data-action="nav"
        data-view="${item.id}"
        ${view === item.id ? 'aria-current="page"' : ""}
      >${icon(item.icon, 20)}<span>${item.shortLabel}</span></button>`,
    ).join("")}
  </nav>`;

export const appShell = (
  page: string,
  state: AppState,
  ui: UiState,
  overlay = "",
): string => `
  <div class="shell">
    ${sidebar(state, ui.view)}
    <main class="shell__main">
      <div class="page">${mobileBrand()}${page}</div>
    </main>
    ${mobileNav(ui.view)}

    ${
      ui.addOpen
        ? ""
        : `<button
            type="button"
            class="fab"
            data-action="open-add"
            aria-label="Add transaction"
          >${icon("plus", 24)}</button>`
    }

    ${overlay}
  </div>`;
