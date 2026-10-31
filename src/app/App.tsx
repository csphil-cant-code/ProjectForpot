import type { ComponentType } from "react";
import { AppShell } from "../components/layout/AppShell";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { TransactionsPage } from "../features/transactions/TransactionsPage";
import { BudgetsPage } from "../features/budgets/BudgetsPage";
import { ReportsPage } from "../features/reports/ReportsPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { useUiState } from "../stores/uiStore";
import type { ViewId } from "../types";

const PAGES: Record<ViewId, ComponentType> = {
  dashboard: DashboardPage,
  transactions: TransactionsPage,
  budgets: BudgetsPage,
  reports: ReportsPage,
  settings: SettingsPage,
};

export function App() {
  const { view } = useUiState();
  const Page = PAGES[view];

  return (
    <AppShell>
      <Page />
    </AppShell>
  );
}
