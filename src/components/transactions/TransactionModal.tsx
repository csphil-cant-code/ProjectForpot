import { useEffect } from "react";
import { useUiState, uiStore } from "../../stores/uiStore";
import { Icon } from "../common/Icon";
import { TransactionForm } from "./TransactionForm";

export function TransactionModal() {
  const { addOpen } = useUiState();

  useEffect(() => {
    if (!addOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") uiStore.closeAdd();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.classList.add("is-locked");
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("is-locked");
    };
  }, [addOpen]);

  if (!addOpen) return null;

  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) uiStore.closeAdd();
      }}
    >
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-modal-title"
      >
        <header className="modal__head">
          <div>
            <h2 className="modal__title" id="tx-modal-title">
              New transaction
            </h2>
            <p className="modal__sub">
              Amount, category, account — that&apos;s it.
            </p>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => uiStore.closeAdd()}
            aria-label="Close"
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        <TransactionForm onDone={() => uiStore.closeAdd()} />
      </div>
    </div>
  );
}
