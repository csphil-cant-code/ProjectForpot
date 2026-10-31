import type { IconName } from "../common/Icon";
import type { ViewId } from "../../types";

export interface NavItem {
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

export const VIEW_TITLES: Record<ViewId, string> = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  budgets: "Budgets",
  reports: "Reports",
  settings: "Settings",
};
