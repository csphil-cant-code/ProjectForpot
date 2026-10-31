import { useUiState, uiStore } from "../../stores/uiStore";
import { currentMonth, monthLabel, shiftMonth } from "../../utils/date";
import { Icon } from "../common/Icon";

export function MonthSwitcher() {
  const { month } = useUiState();
  const thisMonth = currentMonth();
  const atLatest = month >= thisMonth;

  return (
    <div className="month-switch">
      <button
        type="button"
        className="month-switch__btn"
        onClick={() => uiStore.setMonth(shiftMonth(month, -1))}
        aria-label="Previous month"
      >
        <Icon name="chevron-left" size={18} />
      </button>

      <div className="month-switch__label">
        <span className="month-switch__value">{monthLabel(month)}</span>
        {month !== thisMonth ? (
          <button
            type="button"
            className="month-switch__reset"
            onClick={() => uiStore.setMonth(thisMonth)}
          >
            Back to this month
          </button>
        ) : (
          <span className="month-switch__hint">Current month</span>
        )}
      </div>

      <button
        type="button"
        className="month-switch__btn"
        onClick={() => uiStore.setMonth(shiftMonth(month, 1))}
        disabled={atLatest}
        aria-label="Next month"
      >
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  );
}
