import { useEffect, useRef, useState } from "react";
import type { AccountId } from "../../types";
import { PageHeader } from "../../components/layout/PageHeader";
import { CashLogo } from "../../components/common/CashLogo";
import { GcashLogo } from "../../components/common/GcashLogo";
import { Icon } from "../../components/common/Icon";
import { useAppState, budgetStore } from "../../stores/budgetStore";
import { uiStore } from "../../stores/uiStore";
import { exportState } from "../../lib/storage";
import { peso } from "../../utils/format";

export function SettingsPage() {
  const state = useAppState();
  const fileInput = useRef<HTMLInputElement>(null);
  const [gcash, setGcash] = useState(
    String(state.accounts.gcash.startingBalance),
  );
  const [cash, setCash] = useState(String(state.accounts.cash.startingBalance));

  useEffect(() => {
    setGcash(String(state.accounts.gcash.startingBalance));
    setCash(String(state.accounts.cash.startingBalance));
  }, [
    state.accounts.gcash.startingBalance,
    state.accounts.cash.startingBalance,
  ]);

  const commitBalance = (accountId: AccountId, raw: string) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    budgetStore.setStartingBalance(accountId, value);
    uiStore.notify("Starting balance saved.");
  };

  const loadSample = () => {
    if (
      !window.confirm(
        "Replace everything with the sample month? Your current entries will be removed.",
      )
    ) {
      return;
    }
    budgetStore.loadSampleData();
    uiStore.notify("Sample month loaded.");
  };

  const importBackup = async (file: File) => {
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

  const clearAll = () => {
    if (
      !window.confirm(
        "Clear all transactions and budgets? This cannot be undone.",
      )
    ) {
      return;
    }
    budgetStore.clearAllData();
    uiStore.notify("All data cleared.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        subtitle="Fix your starting balances and manage the data on this device."
      />

      <div className="settings-grid">
        <section className="card card--pad">
          <div className="section__head">
            <h2 className="section__title">Starting balances</h2>
            <span className="muted">money before tracking</span>
          </div>
          <p className="section__text">
            Enter what you already had in each wallet when you started using
            Pondo. Everything you log is added on top of these amounts.
          </p>

          <div className="settings-rows">
            <label className="settings-row">
              <span className="settings-row__label">
                <span className="settings-row__icon settings-row__icon--logo">
                  <GcashLogo size={22} decorative />
                </span>
                GCash
              </span>
              <span className="settings-row__input">
                <span>₱</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={gcash}
                  onChange={(event) => setGcash(event.target.value)}
                  onBlur={() => commitBalance("gcash", gcash)}
                  aria-label="GCash starting balance"
                />
              </span>
            </label>

            <label className="settings-row">
              <span className="settings-row__label">
                <span className="settings-row__icon settings-row__icon--logo">
                  <CashLogo size={22} decorative />
                </span>
                Cash
              </span>
              <span className="settings-row__input">
                <span>₱</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={cash}
                  onChange={(event) => setCash(event.target.value)}
                  onBlur={() => commitBalance("cash", cash)}
                  aria-label="Cash starting balance"
                />
              </span>
            </label>
          </div>

          <p className="muted settings-hint">
            Current balance: GCash {peso(state.accounts.gcash.startingBalance)} ·
            Cash {peso(state.accounts.cash.startingBalance)} before transactions.
          </p>
        </section>

        <section className="card card--pad">
          <div className="section__head">
            <h2 className="section__title">Your data</h2>
          </div>
          <p className="section__text">
            Everything is stored locally in this browser. Nothing leaves your
            device unless you export it.
          </p>

          <div className="settings-actions">
            <button
              type="button"
              className="btn btn--soft"
              onClick={() => {
                exportState(state);
                uiStore.notify("Backup downloaded.");
              }}
            >
              <Icon name="download" size={17} />
              Export backup
            </button>
            <button
              type="button"
              className="btn btn--soft"
              onClick={() => fileInput.current?.click()}
            >
              <Icon name="upload" size={17} />
              Import backup
            </button>
            <button type="button" className="btn btn--ghost" onClick={loadSample}>
              <Icon name="refresh" size={17} />
              Load sample month
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void importBackup(file);
              }}
            />
          </div>

          <div className="danger-zone">
            <div>
              <strong>Clear everything</strong>
              <p className="muted">
                Removes transactions, budgets, and custom categories.
              </p>
            </div>
            <button type="button" className="btn btn--danger" onClick={clearAll}>
              <Icon name="trash" size={16} />
              Clear data
            </button>
          </div>
        </section>
      </div>

      <section className="card card--pad about">
        <span className="about__mark">
          <Icon name="leaf" size={22} />
        </span>
        <div>
          <h2 className="section__title">About Pondo</h2>
          <p className="section__text">
            Pondo is your Budget ni Pot for GCash and cash. Log what you
            spend, set monthly limits per category, and watch the numbers settle
            into a pastel-green picture of your money.
          </p>
          <p className="muted">Version 0.1.0 · built with React + TypeScript</p>
        </div>
      </section>
    </>
  );
}
