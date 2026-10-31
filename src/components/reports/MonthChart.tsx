import type { MonthPoint } from "../../types";
import { monthShort } from "../../utils/date";
import { peso, pesoCompact } from "../../utils/format";

export function MonthChart({ points }: { points: MonthPoint[] }) {
  const max = Math.max(
    1,
    ...points.map((point) => Math.max(point.income, point.expense)),
  );

  return (
    <div className="chart">
      <div className="chart__head">
        <h2 className="section__title">Income vs. spending</h2>
        <div className="legend">
          <span className="legend__item">
            <span className="legend__dot legend__dot--income" /> Income
          </span>
          <span className="legend__item">
            <span className="legend__dot legend__dot--expense" /> Spending
          </span>
        </div>
      </div>

      <div className="chart__body">
        <span className="chart__max">{pesoCompact(max)}</span>
        <div className="chart__plot">
          {points.map((point) => (
            <div className="chart__col" key={point.month}>
              <div className="chart__pair">
                <span
                  className="chart__bar chart__bar--income"
                  style={{ height: `${(point.income / max) * 100}%` }}
                  title={`${monthShort(point.month)} income: ${peso(point.income)}`}
                />
                <span
                  className="chart__bar chart__bar--expense"
                  style={{ height: `${(point.expense / max) * 100}%` }}
                  title={`${monthShort(point.month)} spending: ${peso(point.expense)}`}
                />
              </div>
              <span className="chart__label">{monthShort(point.month)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
