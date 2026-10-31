import type { CategorySpend, MonthPoint } from "../types";
import { monthShort } from "../utils/date";
import { percent, peso, pesoCompact } from "../utils/format";
import { escapeHtml } from "../utils/html";

export const monthChart = (points: MonthPoint[]): string => {
  const max = Math.max(
    1,
    ...points.map((point) => Math.max(point.income, point.expense)),
  );

  return `
    <div class="chart">
      <div class="chart__head">
        <h2 class="section__title">Income vs. spending</h2>
        <div class="legend">
          <span class="legend__item">
            <span class="legend__dot legend__dot--income"></span> Income
          </span>
          <span class="legend__item">
            <span class="legend__dot legend__dot--expense"></span> Spending
          </span>
        </div>
      </div>

      <div class="chart__body">
        <span class="chart__max">${pesoCompact(max)}</span>
        <div class="chart__plot">
          ${points
            .map(
              (point) => `
            <div class="chart__col">
              <div class="chart__pair">
                <span
                  class="chart__bar chart__bar--income"
                  style="height:${(point.income / max) * 100}%"
                  title="${monthShort(point.month)} income: ${peso(point.income)}"
                ></span>
                <span
                  class="chart__bar chart__bar--expense"
                  style="height:${(point.expense / max) * 100}%"
                  title="${monthShort(point.month)} spending: ${peso(point.expense)}"
                ></span>
              </div>
              <span class="chart__label">${monthShort(point.month)}</span>
            </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>`;
};

export const categorySplit = (
  items: CategorySpend[],
  total: number,
): string => {
  const visible = items.filter((item) => item.spent > 0);

  return `
    <section class="card card--pad">
      <div class="section__head">
        <h2 class="section__title">Where it went</h2>
        <span class="muted">${peso(total)} spent</span>
      </div>

      ${
        visible.length === 0
          ? `<p class="muted">No spending recorded for this month.</p>`
          : `<div class="split-list">
              ${visible
                .map(({ category, spent }) => {
                  const share = total > 0 ? spent / total : 0;
                  return `
                  <div class="split-row">
                    <div class="split-row__top">
                      <span class="split-row__name">
                        <span
                          class="split-row__badge"
                          style="background:${category.color}"
                          aria-hidden="true"
                        >${category.emoji}</span>
                        ${escapeHtml(category.name)}
                      </span>
                      <span class="split-row__amount">
                        ${peso(spent)}
                        <span class="muted"> · ${percent(share)}</span>
                      </span>
                    </div>
                    <div class="split-row__track">
                      <span
                        class="split-row__fill"
                        style="width:${Math.max(share * 100, 3)}%;background:${category.color}"
                      ></span>
                    </div>
                  </div>`;
                })
                .join("")}
            </div>`
      }
    </section>`;
};

export const balanceDonut = (gcash: number, cash: number): string => {
  const total = gcash + cash;
  const safeGcash = Math.max(0, gcash);
  const safeCash = Math.max(0, cash);
  const angle =
    total > 0 ? (safeGcash / (safeGcash + safeCash || 1)) * 360 : 0;

  return `
    <section class="card card--pad">
      <div class="section__head">
        <h2 class="section__title">Where your money sits</h2>
      </div>

      <div class="donut-wrap">
        <div
          class="donut"
          style="background:${
            total > 0
              ? `conic-gradient(#86c9a1 0deg ${angle}deg, #b9d5e3 ${angle}deg 360deg)`
              : "#e9f0eb"
          }"
          role="img"
          aria-label="GCash ${peso(gcash)}, Cash ${peso(cash)}"
        >
          <div class="donut__center">
            <span>Total</span>
            <strong>${peso(total)}</strong>
          </div>
        </div>

        <ul class="donut__legend">
          <li>
            <span class="legend__dot legend__dot--gcash"></span>
            <div>
              <span class="muted">GCash</span>
              <strong>${peso(gcash)}</strong>
            </div>
            <span class="muted">${percent(total > 0 ? Math.max(0, gcash) / total : 0)}</span>
          </li>
          <li>
            <span class="legend__dot legend__dot--cash"></span>
            <div>
              <span class="muted">Cash</span>
              <strong>${peso(cash)}</strong>
            </div>
            <span class="muted">${percent(total > 0 ? Math.max(0, cash) / total : 0)}</span>
          </li>
        </ul>
      </div>
    </section>`;
};
