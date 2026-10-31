import { useMemo } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { MonthSwitcher } from "../../components/layout/MonthSwitcher";
import { BalanceHero } from "../../components/dashboard/BalanceHero";
import { AccountCard } from "../../components/dashboard/AccountCard";
import { MiniStat } from "../../components/dashboard/MiniStat";
import { BudgetWatch } from "../../components/dashboard/BudgetWatch";
import { RecentActivity } from "../../components/dashboard/RecentActivity";
import { useAppState } from "../../stores/budgetStore";
import { uiStore, useUiState } from "../../stores/uiStore";
import {
  accountBalance,
  accountCount,
  budgetSummary,
  categoryBreakdown,
  monthTotals,
  totalBalance,
  transactionsInMonth,
} from "../../lib/calc";
import { monthLabel } from "../../utils/date";
import { percent, peso, signedPeso } from "../../utils/format";

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export function DashboardPage() {
  const state = useAppState();
  const { month } = useUiState();

  const totals = useMemo(() => monthTotals(state, month), [state, month]);
  const budget = useMemo(() => budgetSummary(state, month), [state, month]);
  const breakdown = useMemo(
    () => categoryBreakdown(state, month),
    [state, month],
  );
  const monthTransactions = useMemo(
    () =>
      transactionsInMonth(state, month).sort(
        (a, b) =>
          b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
      ),
    [state, month],
  );

  const gcash = accountBalance(state, "gcash");
  const cash = accountBalance(state, "cash");
  const total = totalBalance(state);
  const share = (value: number) => (total > 0 ? Math.max(0, value) / total : 0);

  return (
    <>
      <PageHeader
        eyebrow={greeting()}
        title="Dashboard"
        subtitle={`Here's how your GCash and cash look in ${monthLabel(month)}.`}
        actions={<MonthSwitcher />}
      />

      <section className="dash-top">
        <BalanceHero
          total={total}
          net={totals.net}
          month={month}
          gcash={gcash}
          cash={cash}
        />

        <div className="dash-accounts">
          <AccountCard
            account="gcash"
            balance={gcash}
            startingBalance={state.accounts.gcash.startingBalance}
            count={accountCount(state, "gcash")}
            share={share(gcash)}
          />
          <AccountCard
            account="cash"
            balance={cash}
            startingBalance={state.accounts.cash.startingBalance}
            count={accountCount(state, "cash")}
            share={share(cash)}
          />
        </div>
      </section>

      <section className="mini-grid" aria-label="Month summary">
        <MiniStat
          label="Income"
          value={peso(totals.income)}
          hint="money in this month"
          icon="up-right"
          tone="income"
        />
        <MiniStat
          label="Spent"
          value={peso(totals.expense)}
          hint="money out this month"
          icon="down-left"
          tone="expense"
        />
        <MiniStat
          label="Net"
          value={signedPeso(totals.net)}
          hint={totals.net >= 0 ? "you kept more than you spent" : "spending is ahead"}
          icon="coins"
          tone="net"
        />
        <MiniStat
          label="Budget left"
          value={budget.budget > 0 ? peso(budget.remaining) : "No budget"}
          hint={
            budget.budget > 0
              ? `${percent(budget.ratio)} of ${peso(budget.budget)} used`
              : "set limits in Budgets"
          }
          icon="wallet"
          tone="budget"
        />
      </section>

      <section className="dash-bottom">
        <BudgetWatch
          items={breakdown}
          onManage={() => uiStore.setView("budgets")}
        />
        <RecentActivity
          state={state}
          transactions={monthTransactions.slice(0, 5)}
          onViewAll={() => uiStore.setView("transactions")}
        />
      </section>
    </>
  );
}
