# MoneyScope — Task List

## Phase 1: Database Queries (Read Path)

- [x] **Accounts query** — Create `src/db/queries/accounts.ts` with `getAccounts(userId)` to fetch all accounts for a user
- [x] **Budgets query** — Create `src/db/queries/budgets.ts` with `getBudgets(userId)` joining `categoriesTable` to include category name/color
- [x] **Categories query** — Fill in `src/db/queries/categories.ts` with `getCategories(userId)`
- [x] **Dashboard summary query** — Create `src/db/queries/dashboard.ts` with aggregated data (total balance, income/expenses for current month, spending by category)

## Phase 2: Wire Real Data into Pages

- [x] **Accounts page** — Replace placeholder data in `src/app/dashboard/accounts/page.tsx` with `getAccounts()` results
- [x] **Budgets page** — Replace placeholder data in `src/app/dashboard/budgets/page.tsx` with `getBudgets()` results; compute spent amounts from transactions
- [x] **Dashboard page** — Replace placeholder data in `src/app/dashboard/page.tsx` with real query results (summary cards, recent transactions, spending breakdown, accounts)
- [x] **Categories page** (optional) — Create `src/app/dashboard/categories/page.tsx` to view/manage categories; add to navbar

## Phase 3: Write Operations (CRUD)

- [x] **Add transaction** — Form + server action to insert a new transaction
- [x] **Edit transaction** — Inline or modal edit with server action
- [x] **Delete transaction** — Delete button with confirmation
- [x] **Add/edit/delete account** — CRUD for accounts
- [x] **Add/edit/delete budget** — CRUD for budgets
- [x] **Add/edit/delete category** — CRUD for categories

## Phase 4: Authentication & User Context

- [x] **Choose auth provider** — e.g. NextAuth.js, Clerk, or Lucia
- [x] **Set up auth** — Login/signup pages, session management
- [x] **Replace hardcoded userId** — Pull authenticated user ID from session in all queries and server actions
- [x] **Protect dashboard routes** — Redirect unauthenticated users to login

## Phase 5: Polish & UX

- [x] **Per-user currency** — Use `users.currency` from DB instead of hardcoded USD
- [x] **Sorting & filtering** — Add sort/filter controls to the transactions table (by date, amount, category)
- [x] **Pagination** — Paginate transactions if list grows large
- [x] **Search** — Search transactions by description
- [x] **Responsive nav** — Add mobile hamburger menu to the dashboard navbar
- [x] **Loading states** — Add skeleton loaders for async data fetching
- [x] **Error handling** — Graceful error UI for failed DB queries
- [x] **Empty states** — Meaningful empty states for accounts, budgets, categories with CTAs

## Phase 6: Advanced Features

- [ ] **Recurring transactions** — Auto-generate transactions based on `recurring_pattern`
- [ ] **Categorisation rules** — Auto-assign categories to transactions based on `categorisation_rules` patterns
- [x] **Budget alerts** — Notify when spending approaches or exceeds a budget
- [x] **Charts/visualizations** — Monthly spending trends, income vs expenses over time
- [ ] **Export data** — CSV/PDF export of transactions
- [ ] **Dark mode toggle** — Theme switcher (CSS variables already support dark mode)
