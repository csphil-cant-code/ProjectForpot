import { NAV_ITEMS } from "./nav";
import { Icon } from "../common/Icon";
import { useUiState, uiStore } from "../../stores/uiStore";

export function MobileNav() {
  const { view } = useUiState();

  return (
    <nav className="bottom-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`bottom-nav__item${view === item.id ? " is-active" : ""}`}
          onClick={() => uiStore.setView(item.id)}
          aria-current={view === item.id ? "page" : undefined}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.shortLabel}</span>
        </button>
      ))}
    </nav>
  );
}
