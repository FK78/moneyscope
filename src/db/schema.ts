import { boolean, date, integer, pgEnum, pgTable, real, varchar, uuid } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["checking", "savings", "credit_card", "investment"]);
export const periodEnum = pgEnum("period", ["monthly", "weekly"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"]);

// Legacy table used by seed.sql before auth.users integration.
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  currency: varchar({ length: 3 }).notNull(),
  created_at: date().defaultNow(),
});

export const accountsTable = pgTable("accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid("user_id").notNull(),
  name: varchar({ length: 255 }).notNull(),
  type: accountTypeEnum(),
  balance: real().notNull(),
  currency: varchar({ length: 3 }).notNull(),
});

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid("user_id").notNull(),
  name: varchar({ length: 255 }).notNull(),
  color: varchar({ length: 8 }).notNull(),
  icon: varchar({ length: 255 }),
  is_default: boolean().notNull(),
});

export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  account_id: integer("account_id").references(() => accountsTable.id),
  category_id: integer("category_id").references(() => categoriesTable.id),
  type: transactionTypeEnum().notNull(),
  amount: real().notNull(),
  description: varchar({ length: 255 }).notNull(),
  date: date(),
  is_recurring: boolean().notNull(),
  recurring_pattern: varchar({ length: 255 }),
  created_at: date().defaultNow(),
});

export const budgetsTable = pgTable("budgets", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: uuid("user_id").notNull(),
    category_id: integer("category_id").references(() => categoriesTable.id),
    amount: real().notNull(),
    period: periodEnum(),
    start_date: date()
})

export const categorisationRulesTable = pgTable("categorisation_rules", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: uuid("user_id").notNull(),
    pattern: varchar({ length: 255 }).notNull(),
    category_id: integer("category_id").references(() => categoriesTable.id),
    priority: integer().notNull(),
})
