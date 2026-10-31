import type { AppState, CategorySpend, TxKind } from "../types";
import type { UiState } from "../stores/uiStore";
import { CATEGORY_ICONS, QUICK_CATEGORIES } from "../lib/categoryIcons";
import { percent, peso } from "../utils/format";
import { escapeHtml } from "../utils/html";
import { icon } from "./common/Icon";
import { budgetTone, progressBar } from "./common/ui";

export const budgetCard = (item: CategorySpend, ui: UiState): string => {
  const { category, spent, budget, ratio } = item;
  const draft = ui.budgetDrafts[category.id] ?? String(budget || "");
  const over = budget > 0 && spent > budget;
  const remaining = budget - spent;

  return `
    <article class="budget-card">
      <header class="budget-card__head">
        <span
          class="budget-card__badge"
          style="background:${category.color}"
          aria-hidden="true"
        >${category.emoji}</span>
        <div class="budget-card__title">
          <h3>${escapeHtml(category.name)}</h3>
          <span class="muted">
            ${budget > 0 ? `${percent(ratio)} used` : "No budget yet"}
          </span>
        </div>
        <button
          type="button"
          class="icon-btn icon-btn--danger"
          data-action="delete-category"
          data-id="${escapeHtml(category.id)}"
          aria-label="Delete ${escapeHtml(category.name)}"
          title="Delete category"
        >${icon("trash", 16)}</button>
      </header>

      <div class="budget-card__figures">
        <strong>${peso(spent)}</strong>
        <span class="muted">of ${peso(budget)}</span>
      </div>

      ${progressBar(budget > 0 ? ratio : 0, budgetTone(ratio), `${category.name} budget usage`)}

      <footer class="budget-card__foot">
        <span class="${over ? "text-expense" : "muted"}">
          ${
            budget === 0
              ? "Set a monthly limit"
              : over
                ? `${peso(Math.abs(remaining))} over`
                : `${peso(remaining)} left`
          }
        </span>

        <label class="budget-edit">
          <span>₱</span>
          <input
            type="number"
            min="0"
            step="50"
            inputmode="numeric"
            value="${escapeHtml(draft)}"
            placeholder="0"
            data-budget-input
            data-id="${escapeHtml(category.id)}"
            data-focus="budget-${escapeHtml(category.id)}"
            aria-label="Monthly budget for ${escapeHtml(category.name)}"
          />
        </label>
      </footer>
    </article>`;
};

export const addCategoryCard = (state: AppState, ui: UiState): string => {
  const form = ui.addCategory;
  const suggestions = QUICK_CATEGORIES.filter(
    (category) => category.kind === form.kind,
  );
  const isAdded = (name: string): boolean =>
    state.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

  return `
    <form class="card card--pad add-cat" id="add-cat-form">
      <div class="add-cat__head">
        <div>
          <h2 class="section__title">New category</h2>
          <p class="muted">Tap a suggestion, or create your own below.</p>
        </div>

        <div class="toggle-group toggle-group--sm" role="group" aria-label="Category type">
          <button
            type="button"
            class="toggle-group__btn${form.kind === "expense" ? " is-active" : ""}"
            data-action="addcat-kind"
            data-kind="expense"
            aria-pressed="${form.kind === "expense"}"
          >Expense</button>
          <button
            type="button"
            class="toggle-group__btn${form.kind === "income" ? " is-active" : ""}"
            data-action="addcat-kind"
            data-kind="income"
            aria-pressed="${form.kind === "income"}"
          >Income</button>
        </div>
      </div>

      <div class="add-cat__quick">
        <span class="field__label">Quick add</span>
        <div class="add-cat__quick-grid">
          ${suggestions
            .map((preset) => {
              const added = isAdded(preset.name);
              return `<button
                type="button"
                class="quick-cat${added ? " is-added" : ""}"
                data-action="addcat-quick"
                data-name="${escapeHtml(preset.name)}"
                data-kind="${preset.kind}"
                ${added ? "disabled" : ""}
                title="${added ? "Already added" : `Add ${escapeHtml(preset.name)}`}"
              >
                <span aria-hidden="true">${preset.emoji}</span>
                ${escapeHtml(preset.name)} ${icon(added ? "check" : "plus", 13)}
              </button>`;
            })
            .join("")}
        </div>
      </div>

      <div class="add-cat__divider">
        <span>Or create your own</span>
      </div>

      <div class="add-cat__form${form.kind === "income" ? " add-cat__form--income" : ""}">
        <button
          type="button"
          class="add-cat__icon-btn"
          data-action="addcat-toggle-icons"
          aria-expanded="${form.iconsOpen}"
          aria-label="Choose category icon"
          title="Choose icon"
        >
          <span class="add-cat__icon-preview" aria-hidden="true">${form.emoji}</span>
          <span class="add-cat__icon-label">Icon</span>
        </button>

        <label class="field add-cat__name">
          <span class="field__label">Name</span>
          <input
            class="input"
            type="text"
            placeholder="${form.kind === "expense" ? "e.g. Coffee fund" : "e.g. Allowance"}"
            value="${escapeHtml(form.name)}"
            maxlength="28"
            data-field="addcat-name"
            data-focus="addcat-name"
          />
        </label>

        ${
          form.kind === "expense"
            ? `<label class="field add-cat__budget">
                <span class="field__label">
                  Monthly limit <span class="muted">(optional)</span>
                </span>
                <input
                  class="input"
                  type="number"
                  min="0"
                  step="50"
                  placeholder="0"
                  value="${escapeHtml(form.budget)}"
                  data-field="addcat-budget"
                  data-focus="addcat-budget"
                />
              </label>`
            : ""
        }

        <button
          type="submit"
          class="btn btn--primary add-cat__submit"
          ${form.name.trim() ? "" : "disabled"}
        >${icon("plus", 16)} Add</button>
      </div>

      ${
        form.iconsOpen
          ? `<div class="add-cat__icons-wrap">
              <span class="field__label">Pick an icon</span>
              <div class="add-cat__icons" role="group" aria-label="Category icon">
                ${CATEGORY_ICONS.map(
                  (option) => `<button
                    type="button"
                    class="add-cat__icon${form.emoji === option.emoji ? " is-active" : ""}"
                    data-action="addcat-icon"
                    data-emoji="${option.emoji}"
                    aria-label="${escapeHtml(option.label)}"
                    aria-pressed="${form.emoji === option.emoji}"
                    title="${escapeHtml(option.label)}"
                  >${option.emoji}</button>`,
                ).join("")}
              </div>
            </div>`
          : ""
      }
    </form>`;
};

export const quickCategoryKind = (kind: string): TxKind =>
  kind === "income" ? "income" : "expense";
