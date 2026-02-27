import { boolean, date, integer, pgEnum, pgTable, real, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["currentAccount", "savings", "creditCard", "investment"]);
export const periodEnum = pgEnum("period", ["monthly", "weekly"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"]);
export const recurringPatternEnum = pgEnum("recurring_pattern", ["daily", "weekly", "biweekly", "monthly", "yearly"]);

export const defaultCategoryTemplatesTable = pgTable("default_category_templates", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  color: varchar({ length: 8 }).notNull(),
  icon: varchar({ length: 255 }),
  sort_order: integer().notNull().default(0),
  is_active: boolean().notNull().default(true),
});

export const userOnboardingTable = pgTable("user_onboarding", {
  user_id: uuid("user_id").primaryKey(),
  base_currency: varchar({ length: 3 }).notNull().default("GBP"),
  use_default_categories: boolean().notNull().default(false),
  completed: boolean().notNull().default(false),
  completed_at: timestamp("completed_at", { withTimezone: true }),
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
  recurring_pattern: recurringPatternEnum("recurring_pattern"),
  next_recurring_date: date("next_recurring_date"),
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

export const budgetAlertPreferencesTable = pgTable("budget_alert_preferences", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    budget_id: integer("budget_id").notNull().references(() => budgetsTable.id, { onDelete: "cascade" }),
    user_id: uuid("user_id").notNull(),
    threshold: real().notNull().default(80),
    browser_alerts: boolean("browser_alerts").notNull().default(true),
    email_alerts: boolean("email_alerts").notNull().default(false),
})

export const alertTypeEnum = pgEnum("alert_type", ["threshold_warning", "over_budget"]);

export const budgetNotificationsTable = pgTable("budget_notifications", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: uuid("user_id").notNull(),
    budget_id: integer("budget_id").notNull().references(() => budgetsTable.id, { onDelete: "cascade" }),
    alert_type: alertTypeEnum("alert_type").notNull(),
    message: text().notNull(),
    is_read: boolean("is_read").notNull().default(false),
    emailed: boolean().notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
