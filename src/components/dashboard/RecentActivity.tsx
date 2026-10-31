import type { AppState, Transaction } from "../../types";
import { TransactionItem } from "../transactions/TransactionItem";

export function RecentActivity({
  state,
  transactions,
  onViewAll,
}: {
  state: AppState;
  transactions: Transaction[];
  onViewAll: () => void;
}) {
  return (
    <section className="card card--pad">
      <div className="section__head">
        <h2 className="section__title">Recent activity</h2>
        <button type="button" className="linkish" onClick={onViewAll}>
          View all
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="muted">Nothing logged yet this month.</p>
      ) : (
        <ul className="tx-list">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              category={state.categories.find(
                (category) => category.id === transaction.categoryId,
              )}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
