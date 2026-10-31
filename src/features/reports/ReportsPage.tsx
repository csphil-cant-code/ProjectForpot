import { useMemo } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { MonthSwitcher } from "../../components/layout/MonthSwitcher";
import { MiniStat } from "../../components/dashboard/MiniStat";
import { MonthChart } from "../../components/reports/MonthChart";
import { CategorySplit } from "../../components/reports/CategorySplit";
import { BalanceDonut } from "../../components/reports/BalanceDonut";
import { useAppState } from "../../stores/budgetStore";
import { useUiState } from "../../stores/uiStore";
import {
  accountBalance,
  categoryBreakdown,
  monthTotals,
  monthlySeries,
} from "../../lib/calc";
import { monthLabel } from "../../utils/date";
import { peso, signedPeso } from "../../utils/format";

export function ReportsPage() {
  const state = useAppState();
  const { month } = useUiState();

  const totals = useMemo(() => monthTotals(state, month), [state, month]);
  const points = useMemo(
    () => monthlySeries(state, month, 6),
    [state, month],
  );
  const breakdown = useMemo(
    () => categoryBreakdown(state, month),
    [state, month],
  );

  return (
    <>
      <PageHeader
        eyebrow={monthLabel(month)}
        title="Reports"
        subtitle="Zoom out and see the shape of your spending."
        actions={<MonthSwitcher />}
      />

      <section className="mini-grid mini-grid--three">
        <MiniStat
          label="Income"
          value={peso(totals.income)}
          hint={monthLabel(month)}
          icon="up-right"
          tone="income"
        />
        <MiniStat
          label="Spending"
          value={peso(totals.expense)}
          hint={monthLabel(month)}
          icon="down-left"
          tone="expense"
        />
        <MiniStat
          label="Net"
          value={signedPeso(totals.net)}
          hint={totals.net >= 0 ? "surplus" : "deficit"}
          icon="coins"
          tone="net"
        />
      </section>

      <section className="card card--pad chart-card">
        <MonthChart points={points} />
      </section>

      <section className="report-grid">
        <CategorySplit items={breakdown} total={totals.expense} />
        <BalanceDonut
          gcash={accountBalance(state, "gcash")}
          cash={accountBalance(state, "cash")}
        />
      </section>
    </>
  );
}
