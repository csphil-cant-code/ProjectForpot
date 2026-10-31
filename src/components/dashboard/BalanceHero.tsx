import { peso } from "../../utils/format";
import { monthLabel } from "../../utils/date";
import { Icon } from "../common/Icon";

export function BalanceHero({
  total,
  net,
  month,
  gcash,
  cash,
}: {
  total: number;
  net: number;
  month: string;
  gcash: number;
  cash: number;
}) {
  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__top">
        <span className="hero__label">Total money on hand</span>
        <span className="hero__badge">
          <Icon name="leaf" size={14} />
          {monthLabel(month)}
        </span>
      </div>

      <p className="hero__value">{peso(total)}</p>

      <div className="hero__meta">
        <span className={net >= 0 ? "hero__delta is-up" : "hero__delta is-down"}>
          <Icon name={net >= 0 ? "up-right" : "down-left"} size={15} />
          {net >= 0 ? "+" : "−"}
          {peso(Math.abs(net))} this month
        </span>
      </div>

      <div className="hero__split">
        <div>
          <span className="hero__split-label">GCash</span>
          <strong>{peso(gcash)}</strong>
        </div>
        <span className="hero__split-divider" aria-hidden="true" />
        <div>
          <span className="hero__split-label">Cash</span>
          <strong>{peso(cash)}</strong>
        </div>
      </div>
    </section>
  );
}
