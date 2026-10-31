import { peso, percent } from "../../utils/format";

export function BalanceDonut({
  gcash,
  cash,
}: {
  gcash: number;
  cash: number;
}) {
  const total = gcash + cash;
  const safeGcash = Math.max(0, gcash);
  const safeCash = Math.max(0, cash);
  const angle =
    total > 0 ? (safeGcash / (safeGcash + safeCash || 1)) * 360 : 0;

  return (
    <section className="card card--pad">
      <div className="section__head">
        <h2 className="section__title">Where your money sits</h2>
      </div>

      <div className="donut-wrap">
        <div
          className="donut"
          style={{
            background:
              total > 0
                ? `conic-gradient(#86c9a1 0deg ${angle}deg, #b9d5e3 ${angle}deg 360deg)`
                : "#e9f0eb",
          }}
          role="img"
          aria-label={`GCash ${peso(gcash)}, Cash ${peso(cash)}`}
        >
          <div className="donut__center">
            <span>Total</span>
            <strong>{peso(total)}</strong>
          </div>
        </div>

        <ul className="donut__legend">
          <li>
            <span className="legend__dot legend__dot--gcash" />
            <div>
              <span className="muted">GCash</span>
              <strong>{peso(gcash)}</strong>
            </div>
            <span className="muted">
              {percent(total > 0 ? Math.max(0, gcash) / total : 0)}
            </span>
          </li>
          <li>
            <span className="legend__dot legend__dot--cash" />
            <div>
              <span className="muted">Cash</span>
              <strong>{peso(cash)}</strong>
            </div>
            <span className="muted">
              {percent(total > 0 ? Math.max(0, cash) / total : 0)}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
