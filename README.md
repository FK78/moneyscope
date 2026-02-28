<p align="center">
  <img src="public/logo.svg" alt="Flowdget logo" width="120" height="120" />
</p>

<h1 align="center">Flowdget</h1>

<p align="center">A personal finance dashboard for tracking accounts, budgets, transactions, and spending — built with <strong>Next.js 16</strong>, <strong>Drizzle ORM</strong>, and <strong>Supabase Postgres</strong>.</p>

## Features

- **Accounts** — View, add, edit, and delete current account, savings, credit card, and investment accounts with live balance tracking
- **Transactions** — Full CRUD for income and expenses with category labels, account attribution, and recurring indicators. Adding, editing, or deleting a transaction automatically adjusts the linked account balance.
- **Budgets** — Set monthly or weekly budgets per category and track spending progress with visual indicators
- **Dashboard** — Summary cards, recent transactions, spending breakdown by category, and account overview in one place
- **Onboarding Journey** — Guided setup flow for accounts, categories, and budgets with skip options on every step (including skip-all)
- **Default Category Templates** — Default categories are stored in the database and can be opted in/out during onboarding
- **Smart Summary Cards** — Net worth, total assets, and total liabilities classified by account type (not balance sign). Negative balances display correctly with red text and minus sign.
- **Confirmation Dialogs** — Delete actions use a two-step flow: confirmation dialog → success/error result dialog
- **Accessibility** — All dialogs include screen-reader-friendly titles

## Tech Stack

| Layer         | Technology                                 |
| ------------- | ------------------------------------------ |
| Framework     | Next.js 16 (App Router, Server Components) |
| Language      | TypeScript                                 |
| Database      | PostgreSQL via Supabase                    |
| ORM           | Drizzle ORM + Drizzle Kit                  |
| DB Driver     | postgres.js                                |
| Styling       | Tailwind CSS 4                             |
| UI Components | shadcn/ui, Radix UI, Lucide icons          |

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── accounts/       # Accounts page (add, edit, delete)
│   │   ├── budgets/        # Budgets page
│   │   ├── transactions/   # Transactions page (add, edit, delete)
│   │   ├── layout.tsx      # Dashboard shell & navbar
│   │   └── page.tsx        # Dashboard overview
│   ├── layout.tsx          # Root layout
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui components (dialog, alert-dialog, etc.)
│   ├── AccountCard.tsx
│   ├── AddAccountForm.tsx  # Unified add/edit account dialog
│   ├── AddTransactionForm.tsx # Unified add/edit transaction dialog
│   ├── DeleteAccountButton.tsx # Delete account with confirmation
│   ├── SpendCategoryRow.tsx
│   └── TransactionsClient.tsx  # Transaction list with delete, highlight animation
├── db/
│   ├── schema.ts           # Drizzle table definitions
│   ├── queries/            # Per-domain query modules
│   └── mutations/          # Server actions (add, edit, delete)
├── lib/
│   ├── formatCurrency.ts   # Shared currency formatter
│   ├── parseTotal.ts
│   ├── summaryCards.ts
│   └── utils.ts
└── index.ts                # Shared DB instance (postgres.js driver)
```

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (or any PostgreSQL instance)

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/FK78/flowdget.git
   cd flowdget
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your `DATABASE_URL` with your Supabase connection string:

   ```
   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

   Find this in **Supabase Dashboard → Settings → Database → Connection string → URI** (use the Transaction pooler, port 6543).

4. **Create tables & seed the database**

   Run the full `seed.sql` in the Supabase SQL Editor or via CLI:

   ```bash
   psql $DATABASE_URL -f seed.sql
   ```

   This creates all tables, enums, and inserts sample data.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the development server       |
| `npm run build`   | Create a production build          |
| `npm run start`   | Serve the production build         |
| `npm run lint`    | Run ESLint                         |

## Database Schema

Seven core tables plus onboarding/template tables managed by Drizzle ORM:

- **accounts** — per-user financial accounts (current account, savings, creditCard, investment). Balance updated automatically on transaction changes.
- **categories** — spending categories with color and icon
- **transactions** — income/expense records linked to accounts and categories. Cascade-deleted when parent account is removed.
- **budgets** — spending limits per category with monthly/weekly periods
- **categorisation_rules** — pattern-based auto-categorisation rules
- **default_category_templates** — database-backed default category definitions used during onboarding
- **user_onboarding** — per-user onboarding state, base currency, and default-category preference

## License

MIT
