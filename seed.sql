-- Enums
CREATE TYPE account_type AS ENUM ('checking', 'savings', 'credit_card', 'investment');
CREATE TYPE period AS ENUM ('monthly', 'weekly');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Tables
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  type account_type,
  balance REAL NOT NULL,
  currency VARCHAR(3) NOT NULL
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(8) NOT NULL,
  icon VARCHAR(255)
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount REAL NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE,
  is_recurring BOOLEAN NOT NULL,
  recurring_pattern VARCHAR(255),
  created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE budgets (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  period period,
  start_date DATE
);

CREATE TABLE categorisation_rules (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  pattern VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL
);

CREATE TABLE default_category_templates (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(8) NOT NULL,
  icon VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE user_onboarding (
  user_id UUID PRIMARY KEY,
  use_default_categories BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ
);

-- Seed data

INSERT INTO default_category_templates (name, color, icon, sort_order, is_active) VALUES
  ('Groceries', '#4CAF50', 'shopping-cart', 1, true),
  ('Rent', '#F44336', 'home', 2, true),
  ('Salary', '#2196F3', 'briefcase', 3, true),
  ('Utilities', '#607D8B', 'zap', 4, true);