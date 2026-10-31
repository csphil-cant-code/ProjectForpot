import type { AccountId } from "../../types";
import { ACCOUNT_LABEL } from "../../lib/labels";
import { peso, percent } from "../../utils/format";
import { CashLogo } from "../common/CashLogo";
import { GcashLogo } from "../common/GcashLogo";

export function AccountCard({
  account,
  balance,
  startingBalance,
  count,
  share,
}: {
  account: AccountId;
  balance: number;
  startingBalance: number;
  count: number;
  share: number;
}) {
  const tone = account === "gcash" ? "blue" : "green";

  return (
    <article className={`card account-card account-card--${tone}`}>
      <header className="account-card__head">
        <span className="account-card__icon account-card__icon--logo">
          {account === "gcash" ? (
            <GcashLogo size={26} decorative />
          ) : (
            <CashLogo size={26} decorative />
          )}
        </span>
        <span className="account-card__name">{ACCOUNT_LABEL[account]}</span>
        <span className="account-card__share">{percent(share)} of total</span>
      </header>

      <p className="account-card__value">{peso(balance)}</p>

      <div className="account-card__foot">
        <span>{count} transactions</span>
        <span>started at {peso(startingBalance)}</span>
      </div>
    </article>
  );
}
