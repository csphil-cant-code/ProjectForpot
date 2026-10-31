import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Icon } from "../common/Icon";
import { Toast } from "../common/Toast";
import { TransactionModal } from "../transactions/TransactionModal";
import { useUiState, uiStore } from "../../stores/uiStore";

export function AppShell({ children }: { children: ReactNode }) {
  const { addOpen } = useUiState();

  return (
    <div className="shell">
      <Sidebar />
      <main className="shell__main">
        <div className="page">{children}</div>
      </main>
      <MobileNav />

      {!addOpen ? (
        <button
          type="button"
          className="fab"
          onClick={() => uiStore.openAdd()}
          aria-label="Add transaction"
        >
          <Icon name="plus" size={24} />
        </button>
      ) : null}

      <TransactionModal />
      <Toast />
    </div>
  );
}
