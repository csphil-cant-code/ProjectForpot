import { useMemo, useState } from "react";
import type { AccountId, TxKind } from "../../types";
import { PageHeader } from "../../components/layout/PageHeader";
import { MonthSwitcher } from "../../components/layout/MonthSwitcher";
import { TransactionList } from "../../components/transactions/TransactionList";
import { EmptyState } from "../../components/common/EmptyState";
import { Icon } from "../../components/common/Icon";
import { useAppState, budgetStore } from "../../stores/budgetStore";
import { uiStore, useUiState } from "../../stores/uiStore";
import { transactionsInMonth } from "../../lib/calc";
import { monthLabel } from "../../utils/date";
import { peso } from "../../utils/format";

type KindFilter = "all" | TxKind;
type AccountFilter = "all" | AccountId;

export function TransactionsPage() {
  const state = useAppState();
  const { month } = useUiState();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [account, setAccount] = useState<AccountFilter>("all");

  const transactions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return transactionsInMonth(state, month)
      .filter((transaction) => kind === "all" || transaction.kind === kind)
      .filter(
        (transaction) => account === "all" || transaction.account === account,
      )
      .filter((transaction) => {
        if (!needle) return true;
        const category =
          state.categories.find((item) => item.id === transaction.categoryId)
            ?.name ?? "";
        return `${transaction.note} ${category}`.toLowerCase().includes(needle);
      })
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
      );
  }, [state, month, kind, account, query]);

  const totals = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          if (transaction.kind === "income") acc.income += transaction.amount;
          else acc.expense += transaction.amount;
          return acc;
        },
        { income: 0, expense: 0 },
      ),
    [transactions],
  );

  const hasFilters =
    query.trim() !== "" || kind !== "all" || account !== "all";

  const remove = (id: string) => {
    budgetStore.deleteTransaction(id);
    uiStore.notify("Transaction deleted.");
  };

  const resetFilters = () => {
    setQuery("");
    setKind("all");
    setAccount("all");
  };

  return (
    <>
      <PageHeader
        eyebrow={monthLabel(month)}
        title="Transactions"
        subtitle="Every peso in and out, tracked by wallet."
        actions={
          <>
            <MonthSwitcher />
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => uiStore.openAdd()}
            >
              <Icon name="plus" size={17} />
              Add
            </button>
          </>
        }
      />

      <section className="card card--pad filters">
        <label className="search">
          <Icon name="search" size={17} />
          <input
            type="search"
            placeholder="Search notes or categories"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search transactions"
          />
        </label>

        <div className="filters__row">
          <div className="toggle-group toggle-group--sm" role="group" aria-label="Filter by type">
            {(
              [
                ["all", "All"],
                ["expense", "Expenses"],
                ["income", "Income"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`toggle-group__btn${
                  kind === value ? " is-active" : ""
                }`}
                onClick={() => setKind(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="toggle-group toggle-group--sm" role="group" aria-label="Filter by wallet">
            {(
              [
                ["all", "Both"],
                ["gcash", "GCash"],
                ["cash", "Cash"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`toggle-group__btn${
                  account === value ? " is-active" : ""
                }`}
                onClick={() => setAccount(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {hasFilters ? (
            <button type="button" className="linkish" onClick={resetFilters}>
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="filters__totals">
          <span>
            {transactions.length}{" "}
            {transactions.length === 1 ? "record" : "records"}
          </span>
          <span className="text-income">+{peso(totals.income)}</span>
          <span className="text-expense">−{peso(totals.expense)}</span>
        </div>
      </section>

      {transactions.length === 0 ? (
        <EmptyState
          emoji="🧾"
          title={hasFilters ? "No matches" : "No transactions yet"}
          description={
            hasFilters
              ? "Try a different keyword or clear the filters."
              : "Add your first GCash or cash entry to start monitoring your budget."
          }
          action={
            hasFilters ? (
              <button
                type="button"
                className="btn btn--soft"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => uiStore.openAdd()}
              >
                <Icon name="plus" size={17} />
                Add transaction
              </button>
            )
          }
        />
      ) : (
        <TransactionList
          state={state}
          transactions={transactions}
          onDelete={remove}
        />
      )}
    </>
  );
}
