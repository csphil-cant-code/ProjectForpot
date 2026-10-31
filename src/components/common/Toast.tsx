import { useUiState, uiStore } from "../../stores/uiStore";
import { Icon } from "./Icon";

export function Toast() {
  const { toast } = useUiState();
  if (!toast) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__icon">
        <Icon name="check" size={16} />
      </span>
      <span>{toast}</span>
      <button
        type="button"
        className="toast__close"
        onClick={() => uiStore.dismissToast()}
        aria-label="Dismiss notification"
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}
