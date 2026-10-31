import type { AppState, Transaction } from "../../types";
import { peso } from "../../utils/format";
import { relativeDay } from "../../utils/date";
import { TransactionItem } from "./TransactionItem";

interface Group {
  date: string;
  items: Transaction[];
  expense: number;
  income: number;
}

const groupByDate = (transactions: Transaction[]): Group[] => {
  const map = new Map<string, Group>();
  transactions.forEach((transaction) => {
    const group = map.get(transaction.date) ?? {
      date: transaction.date,
      items: [],
      expense: 0,
      income: 0,
    };
    group.items.push(transaction);
    if (transaction.kind === "expense") group.expense += transaction.amount;
    else group.income += transaction.amount;
    map.set(transaction.date, group);
  });

  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
};

export function TransactionList({
  state,
  transactions,
  onDelete,
}: {
  state: AppState;
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  const groups = groupByDate(transactions);

  return (
    <div className="tx-groups">
      {groups.map((group) => (
        <section className="tx-group" key={group.date}>
          <header className="tx-group__head">
            <h3 className="tx-group__date">{relativeDay(group.date)}</h3>
            <p className="tx-group__sums">
              {group.income > 0 ? (
                <span className="text-income">
                  +{peso(group.income)}
                </span>
              ) : null}
              {group.expense > 0 ? (
                <span className="text-expense">−{peso(group.expense)}</span>
              ) : null}
            </p>
          </header>
          <ul className="tx-list">
            {group.items.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                category={state.categories.find(
                  (category) => category.id === transaction.categoryId,
                )}
                onDelete={onDelete}
                showDelete
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
