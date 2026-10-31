import type { AppState } from "../types";
import type { UiState } from "../stores/uiStore";
import { pageHeader, miniStat, monthSwitcher } from "../components/common/ui";
import { balanceDonut, categorySplit, monthChart } from "../components/reports";
import {
  accountBalance,
  categoryBreakdown,
  monthTotals,
  monthlySeries,
} from "../lib/calc";
import { monthLabel } from "../utils/date";
import { peso, signedPeso } from "../utils/format";

export const reportsPage = (state: AppState, ui: UiState): string => {
  const { month } = ui;
  const totals = monthTotals(state, month);
  const points = monthlySeries(state, month, 6);
  const breakdown = categoryBreakdown(state, month);

  return `
    ${pageHeader({
      eyebrow: monthLabel(month),
      title: "Reports",
      subtitle: "Zoom out and see the shape of your spending.",
      actions: monthSwitcher(month),
    })}

    <section class="mini-grid mini-grid--three">
      ${miniStat({
        label: "Income",
        value: peso(totals.income),
        hint: monthLabel(month),
        iconName: "up-right",
        tone: "income",
      })}
      ${miniStat({
        label: "Spending",
        value: peso(totals.expense),
        hint: monthLabel(month),
        iconName: "down-left",
        tone: "expense",
      })}
      ${miniStat({
        label: "Net",
        value: signedPeso(totals.net),
        hint: totals.net >= 0 ? "surplus" : "deficit",
        iconName: "coins",
        tone: "net",
      })}
    </section>

    <section class="card card--pad chart-card">
      ${monthChart(points)}
    </section>

    <section class="report-grid">
      ${categorySplit(breakdown, totals.expense)}
      ${balanceDonut(accountBalance(state, "gcash"), accountBalance(state, "cash"))}
    </section>`;
};
