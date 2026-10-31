import type { Category, Transaction } from "../../types";
import { ACCOUNT_LABEL } from "../../lib/labels";
import { peso } from "../../utils/format";
import { relativeDay } from "../../utils/date";
import { Icon } from "../common/Icon";

export function TransactionItem({
  transaction,
  category,
  onDelete,
  showDelete = false,
}: {
  transaction: Transaction;
  category?: Category;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}) {
  const sign = transaction.kind === "income" ? "+" : "−";

  return (
    <li className="tx">
      <span
        className="tx__badge"
        style={{ background: category?.color ?? "#e6f0e9" }}
        aria-hidden="true"
      >
        {category?.emoji ?? "•"}
      </span>

      <div className="tx__main">
        <span className="tx__title">{category?.name ?? "Uncategorized"}</span>
        <span className="tx__meta">
          {transaction.note || "No note"} · {ACCOUNT_LABEL[transaction.account]}
        </span>
      </div>

      <div className="tx__side">
        <span className={`tx__amount tx__amount--${transaction.kind}`}>
          {sign}
          {peso(transaction.amount)}
        </span>
        <span className="tx__date">{relativeDay(transaction.date)}</span>
      </div>

      {showDelete ? (
        <button
          type="button"
          className="tx__del"
          onClick={() => onDelete?.(transaction.id)}
          aria-label={`Delete ${category?.name ?? "transaction"} on ${transaction.date}`}
        >
          <Icon name="trash" size={16} />
        </button>
      ) : null}
    </li>
  );
}
