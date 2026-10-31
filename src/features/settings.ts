import type { AppState } from "../types";
import { cashLogo, gcashLogo } from "../components/common/Logos";
import { icon } from "../components/common/Icon";
import { pageHeader } from "../components/common/ui";
import { peso } from "../utils/format";

export const settingsPage = (state: AppState): string => `
  ${pageHeader({
    eyebrow: "Preferences",
    title: "Settings",
    subtitle: "Fix your starting balances and manage the data on this device.",
  })}

  <div class="settings-grid">
    <section class="card card--pad">
      <div class="section__head">
        <h2 class="section__title">Starting balances</h2>
        <span class="muted">money before tracking</span>
      </div>
      <p class="section__text">
        Enter what you already had in each wallet when you started using Pondo.
        Everything you log is added on top of these amounts.
      </p>

      <div class="settings-rows">
        <label class="settings-row">
          <span class="settings-row__label">
            <span class="settings-row__icon settings-row__icon--logo">
              ${gcashLogo(22, true)}
            </span>
            GCash
          </span>
          <span class="settings-row__input">
            <span>₱</span>
            <input
              type="number"
              inputmode="decimal"
              step="0.01"
              value="${state.accounts.gcash.startingBalance}"
              data-balance-input
              data-account="gcash"
              aria-label="GCash starting balance"
            />
          </span>
        </label>

        <label class="settings-row">
          <span class="settings-row__label">
            <span class="settings-row__icon settings-row__icon--logo">
              ${cashLogo(22, true)}
            </span>
            Cash
          </span>
          <span class="settings-row__input">
            <span>₱</span>
            <input
              type="number"
              inputmode="decimal"
              step="0.01"
              value="${state.accounts.cash.startingBalance}"
              data-balance-input
              data-account="cash"
              aria-label="Cash starting balance"
            />
          </span>
        </label>
      </div>

      <p class="muted settings-hint">
        Current balance: GCash ${peso(state.accounts.gcash.startingBalance)} ·
        Cash ${peso(state.accounts.cash.startingBalance)} before transactions.
      </p>
    </section>

    <section class="card card--pad">
      <div class="section__head">
        <h2 class="section__title">Your data</h2>
      </div>
      <p class="section__text">
        Everything is stored locally in this browser. Nothing leaves your device
        unless you export it.
      </p>

      <div class="settings-actions">
        <button type="button" class="btn btn--soft" data-action="export-data">
          ${icon("download", 17)} Export backup
        </button>
        <button type="button" class="btn btn--soft" data-action="open-import">
          ${icon("upload", 17)} Import backup
        </button>
        <button type="button" class="btn btn--ghost" data-action="load-sample">
          ${icon("refresh", 17)} Load sample month
        </button>
        <input
          type="file"
          accept="application/json,.json"
          hidden
          data-import-input
        />
      </div>

      <div class="danger-zone">
        <div>
          <strong>Clear everything</strong>
          <p class="muted">Removes transactions, budgets, and custom categories.</p>
        </div>
        <button type="button" class="btn btn--danger" data-action="clear-data">
          ${icon("trash", 16)} Clear data
        </button>
      </div>
    </section>
  </div>

  <section class="card card--pad about">
    <span class="about__mark">${icon("leaf", 22)}</span>
    <div>
      <h2 class="section__title">About Pondo</h2>
      <p class="section__text">
        Pondo is your Budget ni Pot for GCash and cash. Log what you spend, set
        monthly limits per category, and watch the numbers settle into a
        pastel-green picture of your money.
      </p>
      <p class="muted">Version 0.1.0 · built with HTML, CSS &amp; TypeScript</p>
    </div>
  </section>`;
