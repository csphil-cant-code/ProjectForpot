# Pondo

A calm, pastel-green **Budget ni Pot** for **GCash** and **cash**. Log what you
spend and receive, set monthly limits per category, and see exactly how much is
left — all stored locally in your browser.

![Stack](https://img.shields.io/badge/React-18-5faf83) ![TypeScript](https://img.shields.io/badge/TypeScript-5-5faf83) ![Vite](https://img.shields.io/badge/Vite-5-5faf83)

## Features

- **Two wallets, one picture** — separate GCash and cash balances that roll up
  into a total, starting from amounts you set yourself.
- **Fast logging** — expense/income toggle, quick-amount chips, category chips,
  date and note, all in a single modal.
- **Monthly budgets** — set a limit per category, watch progress bars fill, and
  get flagged when a category goes over.
- **Reports** — six-month income-vs-spending chart, category breakdown, and a
  donut showing where your money sits.
- **Month switching** — flip back and forth between months on every page.
- **Private by default** — data lives in `localStorage`; export a JSON backup
  anytime from Settings, and restore it on another device.
- **Responsive** — sidebar on desktop, bottom navigation and floating add button
  on mobile.

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`). The app starts with a
clean slate — zero balances, no categories, no transactions. Add your own
starting balances in **Settings** and create categories in **Budgets** before
logging your first entry. A demo month is available anytime under **Settings →
Load sample month**.

### Scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload |
| `npm run build`   | Type-check and build for production       |
| `npm run preview` | Preview the production build locally      |

## Tech

- **React 18** with function components and hooks
- **TypeScript** in strict mode
- **Vite 5** for dev/build
- **No UI or state libraries** — a tiny `useSyncExternalStore` store keeps the
  bundle light and the data flow explicit
- **No router dependency** — views are switched through the UI store

## Project structure

```
src/
  app/                    App entry: view switching
  components/
    common/               Shared primitives (icons, progress, toast…)
    layout/               Sidebar, mobile nav, page header, month switcher
    dashboard/            Balance hero, account cards, mini stats, budget watch
    budgets/              Budget cards and the new-category form
    transactions/         Modal, form, list and row components
    reports/              Month chart, category split, balance donut
  features/
    dashboard/            Dashboard page
    transactions/         Transactions page with filters
    budgets/              Budget planning page
    reports/              Analytics page
    settings/             Starting balances and data management
    auth/                 (reserved)
    accounts/             (reserved)
    categories/           (reserved)
  services/
    api/                  (reserved for a backend client)
    storage/              (reserved; local persistence lives in src/lib)
  stores/                 budgetStore (data) and uiStore (view/month/modal)
  types/                  Shared TypeScript models
  utils/                  Formatting, dates, ids
  lib/                    Pure calculations, seed data, localStorage, labels
  hooks/                  (reserved for reusable hooks)
  styles/                 Global stylesheet and pastel-green theme tokens
public/                   Static assets
docs/                     Documentation and design notes
tests/                    unit / integration / e2e (reserved)
scripts/                  Automation scripts (reserved)
config/                   Environment and app configuration (reserved)
.github/workflows/        CI/CD (reserved)
```

## How balances are calculated

```
GCash balance = starting GCash + income to GCash − expenses from GCash
Cash balance  = starting cash  + income to cash  − expenses from cash
```

Budget progress compares the month's expenses in each category against its
monthly limit. Values are stored in pesos; amounts are kept to two decimals.

## Data & privacy

Everything is kept in your browser under the `pondo.state.v2` key. Nothing is
uploaded. Use **Settings → Export backup** to download a JSON snapshot before
clearing site data, and **Import backup** to restore it later or move it to
another device.

## Roadmap ideas

- Recurring bills and subscriptions
- Savings goals with target dates
- Optional cloud sync / authentication (see `src/features/auth`)
