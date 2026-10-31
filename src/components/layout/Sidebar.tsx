import { NAV_ITEMS } from "./nav";
import { Icon } from "../common/Icon";
import { useUiState, uiStore } from "../../stores/uiStore";
import { useAppState } from "../../stores/budgetStore";
import { totalBalance } from "../../lib/calc";
import { peso } from "../../utils/format";

export function Sidebar() {
  const { view } = useUiState();
  const state = useAppState();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark">
          <Icon name="leaf" size={22} />
        </span>
        <span className="brand__text">
          <strong>Pondo</strong>
          <small>Budget ni Pot</small>
        </span>
      </div>

      <nav className="nav" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav__item${view === item.id ? " is-active" : ""}`}
            onClick={() => uiStore.setView(item.id)}
            aria-current={view === item.id ? "page" : undefined}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__card">
        <span className="sidebar__card-label">Total balance</span>
        <strong className="sidebar__card-value">{peso(totalBalance(state))}</strong>
        <span className="sidebar__card-hint">GCash + cash on hand</span>
        <button
          type="button"
          className="btn btn--soft btn--sm sidebar__card-btn"
          onClick={() => uiStore.openAdd()}
        >
          <Icon name="plus" size={15} />
          Add transaction
        </button>
      </div>

      <p className="sidebar__footer">Your data stays on this device.</p>
    </aside>
  );
}
