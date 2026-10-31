import type { CategorySpend } from "../../types";
import { peso, percent } from "../../utils/format";

export function CategorySplit({
  items,
  total,
}: {
  items: CategorySpend[];
  total: number;
}) {
  const visible = items.filter((item) => item.spent > 0);

  return (
    <section className="card card--pad">
      <div className="section__head">
        <h2 className="section__title">Where it went</h2>
        <span className="muted">{peso(total)} spent</span>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No spending recorded for this month.</p>
      ) : (
        <div className="split-list">
          {visible.map(({ category, spent }) => {
            const share = total > 0 ? spent / total : 0;
            return (
              <div className="split-row" key={category.id}>
                <div className="split-row__top">
                  <span className="split-row__name">
                    <span
                      className="split-row__badge"
                      style={{ background: category.color }}
                      aria-hidden="true"
                    >
                      {category.emoji}
                    </span>
                    {category.name}
                  </span>
                  <span className="split-row__amount">
                    {peso(spent)}
                    <span className="muted"> · {percent(share)}</span>
                  </span>
                </div>
                <div className="split-row__track">
                  <span
                    className="split-row__fill"
                    style={{
                      width: `${Math.max(share * 100, 3)}%`,
                      background: category.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
