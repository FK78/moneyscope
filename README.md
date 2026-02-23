# MoneyScope

A personal finance dashboard for tracking accounts, budgets, transactions, and spending — built with **Next.js 16**, **Drizzle ORM**, and **Neon Postgres**.

## Features

- **Accounts** — View all checking, savings, credit card, and investment accounts with balances at a glance
- **Transactions** — Browse income and expenses with category labels, account attribution, and recurring indicators
- **Budgets** — Set monthly or weekly budgets per category and track spending progress with visual indicators
- **Dashboard** — Summary cards, recent transactions, spending breakdown by category, and account overview in one place

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | Next.js 16 (App Router, Server Components) |
| Language     | TypeScript                              |
| Database     | PostgreSQL via Neon serverless driver    |
| ORM          | Drizzle ORM + Drizzle Kit               |
| Styling      | Tailwind CSS 4                          |
| UI Components| shadcn/ui, Radix UI, Lucide icons       |

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── accounts/       # Accounts page
│   │   ├── budgets/        # Budgets page
│   │   ├── transactions/   # Transactions page
│   │   ├── layout.tsx      # Dashboard shell & navbar
│   │   └── page.tsx        # Dashboard overview
│   ├── layout.tsx          # Root layout
│   └── globals.css
├── components/ui/          # shadcn/ui components
├── db/
│   ├── schema.ts           # Drizzle table definitions
│   └── queries/            # Per-domain query modules
├── lib/
│   └── utils.ts            # Shared utilities
└── index.ts                # Shared DB instance
```

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database (or any Postgres instance)

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/FK78/moneyscope.git
   cd moneyscope
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your `DATABASE_URL` (Neon connection string or any Postgres URL).

4. **Push the schema & seed the database**

   ```bash
   npx drizzle-kit push
   psql $DATABASE_URL -f seed.sql
   ```

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

Six tables managed by Drizzle ORM:

- **users** — email, name, preferred currency
- **accounts** — per-user financial accounts (checking, savings, credit card, investment)
- **categories** — spending categories with color and icon
- **transactions** — income/expense records linked to accounts and categories
- **budgets** — spending limits per category with monthly/weekly periods
- **categorisation_rules** — pattern-based auto-categorisation rules

## License

MIT
