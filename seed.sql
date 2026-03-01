-- Enums
CREATE TYPE account_type AS ENUM ('currentAccount', 'savings', 'creditCard', 'investment');
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

CREATE TYPE recurring_pattern AS ENUM ('daily', 'weekly', 'biweekly', 'monthly', 'yearly');

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount REAL NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE,
  is_recurring BOOLEAN NOT NULL,
  recurring_pattern recurring_pattern,
  next_recurring_date DATE,
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
  base_currency VARCHAR(3) NOT NULL DEFAULT 'GBP',
  use_default_categories BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ
);

CREATE TYPE alert_type AS ENUM ('threshold_warning', 'over_budget');

CREATE TABLE budget_alert_preferences (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  budget_id INTEGER NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  threshold REAL NOT NULL DEFAULT 80,
  browser_alerts BOOLEAN NOT NULL DEFAULT true,
  email_alerts BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE budget_notifications (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  budget_id INTEGER NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  emailed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed data

INSERT INTO default_category_templates (name, color, icon, sort_order, is_active) VALUES
  ('Groceries', '#4CAF50', 'shopping-cart', 1, true),
  ('Rent', '#F44336', 'home', 2, true),
  ('Salary', '#2196F3', 'briefcase', 3, true),
  ('Utilities', '#607D8B', 'zap', 4, true);

-- ============================================================
-- SEED DATA FOR USER e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea
-- ============================================================

-- Clean up existing data (children first to respect FK constraints)
DELETE FROM budget_notifications  WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea';
DELETE FROM budget_alert_preferences WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea';
DELETE FROM budgets               WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea';
DELETE FROM transactions          WHERE account_id IN (SELECT id FROM accounts WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea');
DELETE FROM categorisation_rules  WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea';
DELETE FROM accounts              WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea';
DELETE FROM categories            WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea';
DELETE FROM user_onboarding       WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea';

-- Onboarding
INSERT INTO user_onboarding (user_id, base_currency, use_default_categories, completed, completed_at)
VALUES ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'GBP', true, true, '2024-08-15T10:30:00Z');

-- Categories (DB generates IDs)
INSERT INTO categories (user_id, name, color, icon) VALUES
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Groceries',      '#4CAF50', 'shopping-cart'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Rent',            '#F44336', 'home'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Salary',          '#2196F3', 'briefcase'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Utilities',       '#607D8B', 'zap'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Dining Out',      '#FF9800', 'utensils'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Transport',       '#9C27B0', 'car'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Entertainment',   '#E91E63', 'film'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Healthcare',      '#00BCD4', 'heart-pulse'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Shopping',        '#FF5722', 'shopping-bag'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Subscriptions',   '#795548', 'repeat'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Freelance',       '#8BC34A', 'laptop'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Gifts',           '#673AB7', 'gift'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Insurance',       '#3F51B5', 'shield'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Investments',     '#009688', 'trending-up'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Personal Care',   '#CDDC39', 'scissors');

-- Accounts (DB generates IDs)
INSERT INTO accounts (user_id, name, type, balance, currency) VALUES
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Barclays Current',   'currentAccount', 3245.67, 'GBP'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Marcus Savings',     'savings',        12580.00, 'GBP'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Amex Credit Card',   'creditCard',     -1842.30, 'GBP'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'Vanguard ISA',       'investment',     28450.00, 'GBP');

-- Helper function: look up category id by name for this user
-- Usage: cat('Groceries') returns the category id
CREATE OR REPLACE FUNCTION cat(p_name text) RETURNS integer AS $$
  SELECT id FROM categories WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea' AND name = p_name;
$$ LANGUAGE sql;

-- Helper function: look up account id by name for this user
-- Usage: acct('Barclays Current') returns the account id
CREATE OR REPLACE FUNCTION acct(p_name text) RETURNS integer AS $$
  SELECT id FROM accounts WHERE user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea' AND name = p_name;
$$ LANGUAGE sql;

-- ============================================================
-- TRANSACTIONS — 18 months of data (2024-08 through 2026-02)
-- ============================================================

INSERT INTO transactions (account_id, category_id, type, amount, description, date, is_recurring, recurring_pattern, next_recurring_date) VALUES

-- ===== 2024-08 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3200.00, 'Monthly Salary',               '2024-08-28', true,  'monthly', '2024-09-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2024-08-01', true,  'monthly', '2024-09-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   62.40, 'Tesco Weekly Shop',            '2024-08-03', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   78.15, 'Sainsburys Groceries',         '2024-08-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   55.30, 'Aldi Weekly Shop',             '2024-08-17', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   91.20, 'Tesco Big Shop',               '2024-08-24', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   85.00, 'Electricity Bill',             '2024-08-05', true,  'monthly', '2024-09-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2024-08-05', true,  'monthly', '2024-09-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2024-08-01', true,  'monthly', '2024-09-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   42.50, 'Nandos Dinner',                '2024-08-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   28.00, 'Pizza Express',                '2024-08-22', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2024-08-15', true,  'monthly', '2024-09-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2024-08-15', true,  'monthly', '2024-09-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2024-08-15', true,  'monthly', '2024-09-15'),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   15.00, 'Cinema Tickets',               '2024-08-18', false, NULL, NULL),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2024-08-28', true,  'monthly', '2024-09-28'),

-- ===== 2024-09 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3200.00, 'Monthly Salary',               '2024-09-28', true,  'monthly', '2024-10-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2024-09-01', true,  'monthly', '2024-10-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   71.80, 'Tesco Weekly Shop',            '2024-09-07', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   68.50, 'Sainsburys Groceries',         '2024-09-14', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   49.90, 'Lidl Weekly Shop',             '2024-09-21', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   83.10, 'Tesco Weekly Shop',            '2024-09-28', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   92.00, 'Electricity Bill',             '2024-09-05', true,  'monthly', '2024-10-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2024-09-05', true,  'monthly', '2024-10-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2024-09-01', true,  'monthly', '2024-10-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   55.00, 'Wagamama Dinner',              '2024-09-12', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2024-09-15', true,  'monthly', '2024-10-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2024-09-15', true,  'monthly', '2024-10-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2024-09-15', true,  'monthly', '2024-10-15'),
(acct('Barclays Current'), cat('Shopping'), 'expense',  120.00, 'Nike Trainers',                '2024-09-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Healthcare'), 'expense',   25.00, 'GP Prescription',              '2024-09-20', false, NULL, NULL),
(acct('Barclays Current'), cat('Freelance'), 'income',   450.00, 'Freelance Web Project',        '2024-09-15', false, NULL, NULL),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2024-09-28', true,  'monthly', '2024-10-28'),

-- ===== 2024-10 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3200.00, 'Monthly Salary',               '2024-10-28', true,  'monthly', '2024-11-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2024-10-01', true,  'monthly', '2024-11-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   66.70, 'Tesco Weekly Shop',            '2024-10-05', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   74.25, 'Waitrose Groceries',           '2024-10-12', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   58.40, 'Aldi Weekly Shop',             '2024-10-19', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   89.00, 'Tesco Big Shop',               '2024-10-26', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  105.00, 'Gas & Electricity',            '2024-10-05', true,  'monthly', '2024-11-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2024-10-05', true,  'monthly', '2024-11-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2024-10-05', true,  'monthly', '2024-11-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2024-10-01', true,  'monthly', '2024-11-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   38.00, 'Five Guys',                    '2024-10-11', false, NULL, NULL),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   67.00, 'Birthday Dinner Out',          '2024-10-25', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2024-10-15', true,  'monthly', '2024-11-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2024-10-15', true,  'monthly', '2024-11-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2024-10-15', true,  'monthly', '2024-11-15'),
(acct('Amex Credit Card'), cat('Shopping'), 'expense',  250.00, 'Winter Coat - Zara',           '2024-10-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2024-10-01', true,  'monthly', '2024-11-01'),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   35.00, 'Concert Tickets',              '2024-10-20', false, NULL, NULL),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2024-10-28', true,  'monthly', '2024-11-28'),

-- ===== 2024-11 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3200.00, 'Monthly Salary',               '2024-11-28', true,  'monthly', '2024-12-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2024-11-01', true,  'monthly', '2024-12-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   70.50, 'Tesco Weekly Shop',            '2024-11-02', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   82.30, 'Sainsburys Groceries',         '2024-11-09', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   60.10, 'Lidl Weekly Shop',             '2024-11-16', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   95.40, 'Tesco Big Shop',               '2024-11-23', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  118.00, 'Gas & Electricity',            '2024-11-05', true,  'monthly', '2024-12-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2024-11-05', true,  'monthly', '2024-12-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2024-11-05', true,  'monthly', '2024-12-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2024-11-01', true,  'monthly', '2024-12-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   44.50, 'Dishoom Dinner',               '2024-11-14', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2024-11-15', true,  'monthly', '2024-12-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2024-11-15', true,  'monthly', '2024-12-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2024-11-15', true,  'monthly', '2024-12-15'),
(acct('Barclays Current'), cat('Gifts'), 'expense',  150.00, 'Christmas Gifts Shopping',     '2024-11-25', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2024-11-01', true,  'monthly', '2024-12-01'),
(acct('Barclays Current'), cat('Personal Care'), 'expense',   35.00, 'Haircut',                      '2024-11-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Freelance'), 'income',   600.00, 'Freelance App Design',         '2024-11-20', false, NULL, NULL),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2024-11-28', true,  'monthly', '2024-12-28'),

-- ===== 2024-12 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3200.00, 'Monthly Salary',               '2024-12-28', true,  'monthly', '2025-01-28'),
(acct('Barclays Current'), cat('Salary'), 'income',  1500.00, 'Christmas Bonus',              '2024-12-20', false, NULL, NULL),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2024-12-01', true,  'monthly', '2025-01-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   88.60, 'Tesco Christmas Shop',         '2024-12-07', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',  125.00, 'Waitrose Christmas Food',      '2024-12-14', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   45.30, 'Aldi Top-up Shop',             '2024-12-21', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  130.00, 'Gas & Electricity',            '2024-12-05', true,  'monthly', '2025-01-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2024-12-05', true,  'monthly', '2025-01-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2024-12-05', true,  'monthly', '2025-01-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2024-12-01', true,  'monthly', '2025-01-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   95.00, 'Christmas Dinner Out',         '2024-12-23', false, NULL, NULL),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   52.00, 'NYE Dinner',                   '2024-12-31', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2024-12-15', true,  'monthly', '2025-01-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2024-12-15', true,  'monthly', '2025-01-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2024-12-15', true,  'monthly', '2025-01-15'),
(acct('Amex Credit Card'), cat('Shopping'), 'expense',  180.00, 'Christmas Gifts - John Lewis', '2024-12-10', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Shopping'), 'expense',   95.00, 'Boxing Day Sale - ASOS',       '2024-12-26', false, NULL, NULL),
(acct('Barclays Current'), cat('Gifts'), 'expense',  200.00, 'Christmas Gifts for Family',   '2024-12-18', false, NULL, NULL),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   25.00, 'Pantomime Tickets',            '2024-12-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2024-12-01', true,  'monthly', '2025-01-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  500.00, 'ISA Transfer (bonus top-up)',  '2024-12-28', false, NULL, NULL),

-- ===== 2025-01 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary (pay rise)',    '2025-01-28', true,  'monthly', '2025-02-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-01-01', true,  'monthly', '2025-02-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   72.40, 'Tesco Weekly Shop',            '2025-01-04', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   65.80, 'Sainsburys Groceries',         '2025-01-11', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   58.90, 'Aldi Weekly Shop',             '2025-01-18', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   77.20, 'Tesco Weekly Shop',            '2025-01-25', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  140.00, 'Gas & Electricity (winter)',   '2025-01-05', true,  'monthly', '2025-02-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-01-05', true,  'monthly', '2025-02-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-01-05', true,  'monthly', '2025-02-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-01-01', true,  'monthly', '2025-02-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   33.50, 'Wagamama Lunch',               '2025-01-15', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-01-15', true,  'monthly', '2025-02-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-01-15', true,  'monthly', '2025-02-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-01-15', true,  'monthly', '2025-02-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-01-15', true,  'monthly', '2025-02-15'),
(acct('Barclays Current'), cat('Healthcare'), 'expense',   55.00, 'Dentist Check-up',             '2025-01-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Personal Care'), 'expense',   35.00, 'Haircut',                      '2025-01-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Shopping'), 'expense',   65.00, 'January Sales - H&M',         '2025-01-02', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-01-01', true,  'monthly', '2025-02-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-01-28', true,  'monthly', '2025-02-28'),

-- ===== 2025-02 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-02-28', true,  'monthly', '2025-03-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-02-01', true,  'monthly', '2025-03-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   69.30, 'Tesco Weekly Shop',            '2025-02-01', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   73.60, 'Sainsburys Groceries',         '2025-02-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   52.40, 'Lidl Weekly Shop',             '2025-02-15', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   81.90, 'Tesco Weekly Shop',            '2025-02-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  125.00, 'Gas & Electricity',            '2025-02-05', true,  'monthly', '2025-03-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-02-05', true,  'monthly', '2025-03-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-02-05', true,  'monthly', '2025-03-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-02-01', true,  'monthly', '2025-03-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   85.00, 'Valentines Dinner',            '2025-02-14', false, NULL, NULL),
(acct('Barclays Current'), cat('Gifts'), 'expense',   60.00, 'Valentines Gift',              '2025-02-13', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-02-15', true,  'monthly', '2025-03-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-02-15', true,  'monthly', '2025-03-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-02-15', true,  'monthly', '2025-03-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-02-15', true,  'monthly', '2025-03-15'),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   18.00, 'Vue Cinema',                   '2025-02-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Freelance'), 'income',   800.00, 'Freelance API Project',        '2025-02-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-02-01', true,  'monthly', '2025-03-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-02-28', true,  'monthly', '2025-03-28'),

-- ===== 2025-03 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-03-28', true,  'monthly', '2025-04-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-03-01', true,  'monthly', '2025-04-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   74.10, 'Tesco Weekly Shop',            '2025-03-01', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   68.90, 'Waitrose Groceries',           '2025-03-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   55.60, 'Aldi Weekly Shop',             '2025-03-15', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   86.30, 'Tesco Big Shop',               '2025-03-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   42.00, 'Sainsburys Top-up',            '2025-03-29', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  110.00, 'Gas & Electricity',            '2025-03-05', true,  'monthly', '2025-04-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-03-05', true,  'monthly', '2025-04-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-03-05', true,  'monthly', '2025-04-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-03-01', true,  'monthly', '2025-04-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   41.00, 'Nandos Dinner',                '2025-03-07', false, NULL, NULL),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   29.50, 'Greggs Lunch x5',             '2025-03-20', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-03-15', true,  'monthly', '2025-04-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-03-15', true,  'monthly', '2025-04-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-03-15', true,  'monthly', '2025-04-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-03-15', true,  'monthly', '2025-04-15'),
(acct('Barclays Current'), cat('Healthcare'), 'expense',   40.00, 'Optician Appointment',         '2025-03-18', false, NULL, NULL),
(acct('Barclays Current'), cat('Shopping'), 'expense',   89.00, 'Spring Clothes - Uniqlo',     '2025-03-12', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-03-01', true,  'monthly', '2025-04-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-03-28', true,  'monthly', '2025-04-28'),

-- ===== 2025-04 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-04-28', true,  'monthly', '2025-05-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-04-01', true,  'monthly', '2025-05-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   67.80, 'Tesco Weekly Shop',            '2025-04-05', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   72.50, 'Sainsburys Groceries',         '2025-04-12', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   59.10, 'Aldi Weekly Shop',             '2025-04-19', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   84.70, 'Tesco Weekly Shop',            '2025-04-26', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   98.00, 'Gas & Electricity',            '2025-04-05', true,  'monthly', '2025-05-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-04-05', true,  'monthly', '2025-05-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-04-05', true,  'monthly', '2025-05-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-04-01', true,  'monthly', '2025-05-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   48.00, 'Dishoom Brunch',               '2025-04-06', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-04-15', true,  'monthly', '2025-05-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-04-15', true,  'monthly', '2025-05-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-04-15', true,  'monthly', '2025-05-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-04-15', true,  'monthly', '2025-05-15'),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   55.00, 'Theatre Tickets',              '2025-04-18', false, NULL, NULL),
(acct('Barclays Current'), cat('Personal Care'), 'expense',   35.00, 'Haircut',                      '2025-04-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Freelance'), 'income',   350.00, 'Freelance Logo Design',        '2025-04-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-04-01', true,  'monthly', '2025-05-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-04-28', true,  'monthly', '2025-05-28'),

-- ===== 2025-05 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-05-28', true,  'monthly', '2025-06-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-05-01', true,  'monthly', '2025-06-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   63.20, 'Tesco Weekly Shop',            '2025-05-03', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   79.40, 'Sainsburys Groceries',         '2025-05-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   54.80, 'Lidl Weekly Shop',             '2025-05-17', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   88.60, 'Tesco Big Shop',               '2025-05-24', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   90.00, 'Gas & Electricity',            '2025-05-05', true,  'monthly', '2025-06-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-05-05', true,  'monthly', '2025-06-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-05-05', true,  'monthly', '2025-06-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-05-01', true,  'monthly', '2025-06-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   36.00, 'Pizza Express Lunch',          '2025-05-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   72.00, 'Birthday Dinner - Hawksmoor',  '2025-05-20', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-05-15', true,  'monthly', '2025-06-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-05-15', true,  'monthly', '2025-06-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-05-15', true,  'monthly', '2025-06-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-05-15', true,  'monthly', '2025-06-15'),
(acct('Barclays Current'), cat('Shopping'), 'expense',  150.00, 'Summer Wardrobe - Zara',       '2025-05-25', false, NULL, NULL),
(acct('Barclays Current'), cat('Gifts'), 'expense',   40.00, 'Mums Birthday Gift',           '2025-05-12', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-05-01', true,  'monthly', '2025-06-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-05-28', true,  'monthly', '2025-06-28'),

-- ===== 2025-06 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-06-28', true,  'monthly', '2025-07-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-06-01', true,  'monthly', '2025-07-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   71.50, 'Tesco Weekly Shop',            '2025-06-07', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   66.90, 'Waitrose Groceries',           '2025-06-14', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   57.30, 'Aldi Weekly Shop',             '2025-06-21', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   82.10, 'Tesco Weekly Shop',            '2025-06-28', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   82.00, 'Gas & Electricity',            '2025-06-05', true,  'monthly', '2025-07-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-06-05', true,  'monthly', '2025-07-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-06-05', true,  'monthly', '2025-07-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-06-01', true,  'monthly', '2025-07-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   45.00, 'Wagamama Dinner',              '2025-06-12', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-06-15', true,  'monthly', '2025-07-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-06-15', true,  'monthly', '2025-07-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-06-15', true,  'monthly', '2025-07-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-06-15', true,  'monthly', '2025-07-15'),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   42.00, 'Festival Day Ticket',          '2025-06-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Transport'), 'expense',   85.00, 'Uber rides (week)',            '2025-06-20', false, NULL, NULL),
(acct('Barclays Current'), cat('Freelance'), 'income',  1200.00, 'Freelance React Project',      '2025-06-18', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-06-01', true,  'monthly', '2025-07-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-06-28', true,  'monthly', '2025-07-28'),

-- ===== 2025-07 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-07-28', true,  'monthly', '2025-08-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-07-01', true,  'monthly', '2025-08-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   68.30, 'Tesco Weekly Shop',            '2025-07-05', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   75.80, 'Sainsburys Groceries',         '2025-07-12', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   51.90, 'Lidl Weekly Shop',             '2025-07-19', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   90.40, 'Tesco BBQ Shop',               '2025-07-26', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   78.00, 'Gas & Electricity (summer)',   '2025-07-05', true,  'monthly', '2025-08-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   38.00, 'Water Bill (summer)',          '2025-07-05', true,  'monthly', '2025-08-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-07-05', true,  'monthly', '2025-08-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-07-01', true,  'monthly', '2025-08-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   55.00, 'Nandos Group Dinner',          '2025-07-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   38.50, 'Five Guys Lunch',              '2025-07-24', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-07-15', true,  'monthly', '2025-08-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-07-15', true,  'monthly', '2025-08-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-07-15', true,  'monthly', '2025-08-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-07-15', true,  'monthly', '2025-08-15'),
(acct('Amex Credit Card'), cat('Shopping'), 'expense',  200.00, 'Summer Sale - Selfridges',     '2025-07-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Personal Care'), 'expense',   35.00, 'Haircut',                      '2025-07-15', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-07-01', true,  'monthly', '2025-08-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-07-28', true,  'monthly', '2025-08-28'),

-- ===== 2025-08 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-08-28', true,  'monthly', '2025-09-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-08-01', true,  'monthly', '2025-09-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   73.60, 'Tesco Weekly Shop',            '2025-08-02', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   81.20, 'Waitrose Groceries',           '2025-08-09', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   56.70, 'Aldi Weekly Shop',             '2025-08-16', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   87.40, 'Tesco Weekly Shop',            '2025-08-23', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   44.50, 'Sainsburys Top-up',            '2025-08-30', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   75.00, 'Gas & Electricity',            '2025-08-05', true,  'monthly', '2025-09-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   38.00, 'Water Bill',                   '2025-08-05', true,  'monthly', '2025-09-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-08-05', true,  'monthly', '2025-09-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-08-01', true,  'monthly', '2025-09-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   62.00, 'Dishoom Dinner',               '2025-08-14', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-08-15', true,  'monthly', '2025-09-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-08-15', true,  'monthly', '2025-09-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-08-15', true,  'monthly', '2025-09-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-08-15', true,  'monthly', '2025-09-15'),
(acct('Barclays Current'), cat('Healthcare'), 'expense',   30.00, 'Pharmacy Prescriptions',       '2025-08-20', false, NULL, NULL),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   65.00, 'Reading Festival Ticket',      '2025-08-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-08-01', true,  'monthly', '2025-09-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-08-28', true,  'monthly', '2025-09-28'),

-- ===== 2025-09 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-09-28', true,  'monthly', '2025-10-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-09-01', true,  'monthly', '2025-10-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   70.20, 'Tesco Weekly Shop',            '2025-09-06', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   77.50, 'Sainsburys Groceries',         '2025-09-13', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   53.80, 'Lidl Weekly Shop',             '2025-09-20', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   85.90, 'Tesco Weekly Shop',            '2025-09-27', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',   88.00, 'Gas & Electricity',            '2025-09-05', true,  'monthly', '2025-10-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-09-05', true,  'monthly', '2025-10-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-09-05', true,  'monthly', '2025-10-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-09-01', true,  'monthly', '2025-10-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   44.00, 'Wagamama Dinner',              '2025-09-11', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-09-15', true,  'monthly', '2025-10-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-09-15', true,  'monthly', '2025-10-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-09-15', true,  'monthly', '2025-10-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-09-15', true,  'monthly', '2025-10-15'),
(acct('Barclays Current'), cat('Shopping'), 'expense',  110.00, 'Autumn Jacket - COS',          '2025-09-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Freelance'), 'income',   500.00, 'Freelance Consulting',         '2025-09-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-09-01', true,  'monthly', '2025-10-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-09-28', true,  'monthly', '2025-10-28'),

-- ===== 2025-10 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-10-28', true,  'monthly', '2025-11-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-10-01', true,  'monthly', '2025-11-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   69.40, 'Tesco Weekly Shop',            '2025-10-04', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   76.80, 'Waitrose Groceries',           '2025-10-11', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   60.50, 'Aldi Weekly Shop',             '2025-10-18', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   91.30, 'Tesco Big Shop',               '2025-10-25', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  100.00, 'Gas & Electricity',            '2025-10-05', true,  'monthly', '2025-11-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-10-05', true,  'monthly', '2025-11-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-10-05', true,  'monthly', '2025-11-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-10-01', true,  'monthly', '2025-11-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   52.00, 'Pizza Express Birthday',       '2025-10-15', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-10-15', true,  'monthly', '2025-11-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-10-15', true,  'monthly', '2025-11-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-10-15', true,  'monthly', '2025-11-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-10-15', true,  'monthly', '2025-11-15'),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   30.00, 'Halloween Party Supplies',     '2025-10-28', false, NULL, NULL),
(acct('Barclays Current'), cat('Personal Care'), 'expense',   35.00, 'Haircut',                      '2025-10-09', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-10-01', true,  'monthly', '2025-11-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-10-28', true,  'monthly', '2025-11-28'),

-- ===== 2025-11 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-11-28', true,  'monthly', '2025-12-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-11-01', true,  'monthly', '2025-12-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   75.30, 'Tesco Weekly Shop',            '2025-11-01', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   80.60, 'Sainsburys Groceries',         '2025-11-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   62.10, 'Lidl Weekly Shop',             '2025-11-15', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   93.80, 'Tesco Big Shop',               '2025-11-22', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   48.50, 'Aldi Top-up',                  '2025-11-29', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  115.00, 'Gas & Electricity',            '2025-11-05', true,  'monthly', '2025-12-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-11-05', true,  'monthly', '2025-12-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-11-05', true,  'monthly', '2025-12-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-11-01', true,  'monthly', '2025-12-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   48.00, 'Nandos Dinner',                '2025-11-13', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-11-15', true,  'monthly', '2025-12-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-11-15', true,  'monthly', '2025-12-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-11-15', true,  'monthly', '2025-12-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-11-15', true,  'monthly', '2025-12-15'),
(acct('Amex Credit Card'), cat('Shopping'), 'expense',  180.00, 'Black Friday - Amazon',        '2025-11-28', false, NULL, NULL),
(acct('Barclays Current'), cat('Gifts'), 'expense',  100.00, 'Early Christmas Shopping',     '2025-11-20', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-11-01', true,  'monthly', '2025-12-01'),
(acct('Barclays Current'), cat('Freelance'), 'income',   750.00, 'Freelance WordPress Site',     '2025-11-25', false, NULL, NULL),
(acct('Marcus Savings'), cat('Investments'), 'expense',  200.00, 'ISA Transfer',                 '2025-11-28', true,  'monthly', '2025-12-28'),

-- ===== 2025-12 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3350.00, 'Monthly Salary',               '2025-12-28', true,  'monthly', '2026-01-28'),
(acct('Barclays Current'), cat('Salary'), 'income',  1600.00, 'Christmas Bonus',              '2025-12-19', false, NULL, NULL),
(acct('Barclays Current'), cat('Rent'), 'expense', 1100.00, 'Rent Payment',                 '2025-12-01', true,  'monthly', '2026-01-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   92.40, 'Tesco Christmas Shop',         '2025-12-06', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',  130.00, 'M&S Christmas Food',           '2025-12-13', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   48.70, 'Aldi Last-minute Shop',        '2025-12-23', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  128.00, 'Gas & Electricity',            '2025-12-05', true,  'monthly', '2026-01-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2025-12-05', true,  'monthly', '2026-01-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   45.00, 'Council Tax',                  '2025-12-05', true,  'monthly', '2026-01-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  135.00, 'Monthly Oyster Card',          '2025-12-01', true,  'monthly', '2026-01-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',  105.00, 'Christmas Dinner - The Ivy',   '2025-12-24', false, NULL, NULL),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   58.00, 'NYE Dinner Out',               '2025-12-31', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   14.99, 'Netflix Subscription',         '2025-12-15', true,  'monthly', '2026-01-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2025-12-15', true,  'monthly', '2026-01-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2025-12-15', true,  'monthly', '2026-01-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2025-12-15', true,  'monthly', '2026-01-15'),
(acct('Amex Credit Card'), cat('Shopping'), 'expense',  220.00, 'Christmas Gifts - Selfridges', '2025-12-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Gifts'), 'expense',  250.00, 'Christmas Gifts for Family',   '2025-12-15', false, NULL, NULL),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   28.00, 'Pantomime Tickets',            '2025-12-21', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   45.00, 'Contents Insurance',           '2025-12-01', true,  'monthly', '2026-01-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  400.00, 'ISA Transfer (bonus top-up)',  '2025-12-28', false, NULL, NULL),

-- ===== 2026-01 =====
(acct('Barclays Current'), cat('Salary'), 'income',  3500.00, 'Monthly Salary (pay rise)',    '2026-01-28', true,  'monthly', '2026-02-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1150.00, 'Rent Payment (increase)',      '2026-01-01', true,  'monthly', '2026-02-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   70.80, 'Tesco Weekly Shop',            '2026-01-03', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   76.30, 'Sainsburys Groceries',         '2026-01-10', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   55.90, 'Aldi Weekly Shop',             '2026-01-17', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   84.50, 'Tesco Weekly Shop',            '2026-01-24', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   41.20, 'Lidl Top-up',                  '2026-01-31', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  145.00, 'Gas & Electricity (winter)',   '2026-01-05', true,  'monthly', '2026-02-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2026-01-05', true,  'monthly', '2026-02-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   48.00, 'Council Tax (increase)',       '2026-01-05', true,  'monthly', '2026-02-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  142.00, 'Monthly Oyster Card (increase)', '2026-01-01', true,  'monthly', '2026-02-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   35.50, 'Wagamama Lunch',               '2026-01-16', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   15.99, 'Netflix Subscription (increase)', '2026-01-15', true,  'monthly', '2026-02-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2026-01-15', true,  'monthly', '2026-02-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2026-01-15', true,  'monthly', '2026-02-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2026-01-15', true,  'monthly', '2026-02-15'),
(acct('Barclays Current'), cat('Shopping'), 'expense',   78.00, 'January Sales - Uniqlo',       '2026-01-04', false, NULL, NULL),
(acct('Barclays Current'), cat('Healthcare'), 'expense',   60.00, 'Dentist + Hygienist',          '2026-01-20', false, NULL, NULL),
(acct('Barclays Current'), cat('Personal Care'), 'expense',   38.00, 'Haircut',                      '2026-01-12', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   48.00, 'Contents Insurance (increase)', '2026-01-01', true,  'monthly', '2026-02-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  250.00, 'ISA Transfer (increased)',     '2026-01-28', true,  'monthly', '2026-02-28'),

-- ===== 2026-02 (current month — partial) =====
(acct('Barclays Current'), cat('Salary'), 'income',  3500.00, 'Monthly Salary',               '2026-02-28', true,  'monthly', '2026-03-28'),
(acct('Barclays Current'), cat('Rent'), 'expense', 1150.00, 'Rent Payment',                 '2026-02-01', true,  'monthly', '2026-03-01'),
(acct('Barclays Current'), cat('Groceries'), 'expense',   72.60, 'Tesco Weekly Shop',            '2026-02-07', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   79.80, 'Sainsburys Groceries',         '2026-02-14', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   56.40, 'Lidl Weekly Shop',             '2026-02-21', false, NULL, NULL),
(acct('Barclays Current'), cat('Groceries'), 'expense',   88.10, 'Tesco Weekly Shop',            '2026-02-28', false, NULL, NULL),
(acct('Barclays Current'), cat('Utilities'), 'expense',  138.00, 'Gas & Electricity',            '2026-02-05', true,  'monthly', '2026-03-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   32.00, 'Water Bill',                   '2026-02-05', true,  'monthly', '2026-03-05'),
(acct('Barclays Current'), cat('Utilities'), 'expense',   48.00, 'Council Tax',                  '2026-02-05', true,  'monthly', '2026-03-05'),
(acct('Barclays Current'), cat('Transport'), 'expense',  142.00, 'Monthly Oyster Card',          '2026-02-01', true,  'monthly', '2026-03-01'),
(acct('Barclays Current'), cat('Dining Out'), 'expense',   92.00, 'Valentines Dinner - Sketch',   '2026-02-14', false, NULL, NULL),
(acct('Barclays Current'), cat('Gifts'), 'expense',   75.00, 'Valentines Gift',              '2026-02-13', false, NULL, NULL),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   15.99, 'Netflix Subscription',         '2026-02-15', true,  'monthly', '2026-03-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   10.99, 'Spotify Premium',              '2026-02-15', true,  'monthly', '2026-03-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',    7.99, 'iCloud Storage',               '2026-02-15', true,  'monthly', '2026-03-15'),
(acct('Amex Credit Card'), cat('Subscriptions'), 'expense',   11.99, 'ChatGPT Plus',                 '2026-02-15', true,  'monthly', '2026-03-15'),
(acct('Barclays Current'), cat('Entertainment'), 'expense',   22.00, 'Vue Cinema Date Night',        '2026-02-08', false, NULL, NULL),
(acct('Barclays Current'), cat('Freelance'), 'income',   950.00, 'Freelance Next.js Project',    '2026-02-18', false, NULL, NULL),
(acct('Barclays Current'), cat('Insurance'), 'expense',   48.00, 'Contents Insurance',           '2026-02-01', true,  'monthly', '2026-03-01'),
(acct('Marcus Savings'), cat('Investments'), 'expense',  250.00, 'ISA Transfer',                 '2026-02-28', true,  'monthly', '2026-03-28');

-- ============================================================
-- BUDGETS
-- ============================================================

INSERT INTO budgets (user_id, category_id, amount, period, start_date) VALUES
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Groceries'),      350.00, 'monthly', '2024-08-01'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Dining Out'),     200.00, 'monthly', '2024-08-01'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Transport'),      250.00, 'monthly', '2024-08-01'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Entertainment'),  100.00, 'monthly', '2024-08-01'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Shopping'),       200.00, 'monthly', '2024-08-01'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Subscriptions'),   60.00, 'monthly', '2024-08-01'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Utilities'),      250.00, 'monthly', '2024-08-01'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', cat('Gifts'),          150.00, 'monthly', '2024-08-01');

-- Helper function: look up budget id by category name for this user
CREATE OR REPLACE FUNCTION bdgt(p_cat_name text) RETURNS integer AS $$
  SELECT b.id FROM budgets b JOIN categories c ON b.category_id = c.id
  WHERE b.user_id = 'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea' AND c.name = p_cat_name;
$$ LANGUAGE sql;

-- ============================================================
-- CATEGORISATION RULES
-- ============================================================

INSERT INTO categorisation_rules (user_id, pattern, category_id, priority) VALUES
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'tesco',          cat('Groceries'), 1),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'sainsburys',      cat('Groceries'), 1),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'aldi',            cat('Groceries'), 1),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'lidl',            cat('Groceries'), 1),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'waitrose',        cat('Groceries'), 1),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'nandos',          cat('Dining Out'), 2),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'wagamama',        cat('Dining Out'), 2),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'uber',            cat('Transport'), 3),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'oyster',          cat('Transport'), 3),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'netflix',         cat('Subscriptions'), 4),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'spotify',         cat('Subscriptions'), 4),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'electricity',     cat('Utilities'), 5),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'gas',             cat('Utilities'), 5),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'water bill',      cat('Utilities'), 5),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'council tax',     cat('Utilities'), 5),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'rent',            cat('Rent'), 6),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'salary',          cat('Salary'), 7),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'freelance',       cat('Freelance'), 8),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'insurance',       cat('Insurance'), 9),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 'haircut',         cat('Personal Care'), 10);

-- ============================================================
-- BUDGET ALERT PREFERENCES
-- ============================================================

INSERT INTO budget_alert_preferences (budget_id, user_id, threshold, browser_alerts, email_alerts) VALUES
  (bdgt('Groceries'),      'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 80, true, false),
  (bdgt('Dining Out'),     'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 75, true, true),
  (bdgt('Transport'),      'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 80, true, false),
  (bdgt('Entertainment'),  'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 90, true, false),
  (bdgt('Shopping'),       'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 80, true, true),
  (bdgt('Subscriptions'),  'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 85, true, false),
  (bdgt('Utilities'),      'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 80, true, false),
  (bdgt('Gifts'),          'e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', 80, true, false);

-- ============================================================
-- BUDGET NOTIFICATIONS (sample historical alerts)
-- ============================================================

INSERT INTO budget_notifications (user_id, budget_id, alert_type, message, is_read, emailed, created_at) VALUES
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Shopping'),    'over_budget',       'Shopping budget exceeded! You spent £250.00 of your £200.00 budget.',    true, true,  '2024-10-09T12:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Dining Out'),  'threshold_warning', 'Dining Out spending is at 82% of your £200.00 budget.',                 true, true,  '2024-12-24T18:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Shopping'),    'over_budget',       'Shopping budget exceeded! You spent £275.00 of your £200.00 budget.',    true, false, '2024-12-27T10:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Gifts'),       'over_budget',       'Gifts budget exceeded! You spent £200.00 of your £150.00 budget.',      true, false, '2024-12-18T14:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Groceries'),   'threshold_warning', 'Groceries spending is at 85% of your £350.00 budget.',                  true, false, '2025-03-29T16:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Utilities'),   'threshold_warning', 'Utilities spending is at 88% of your £250.00 budget.',                  true, false, '2025-01-06T09:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Shopping'),    'over_budget',       'Shopping budget exceeded! You spent £200.00 of your £200.00 budget.',    true, true,  '2025-07-08T15:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Gifts'),       'threshold_warning', 'Gifts spending is at 83% of your £150.00 budget.',                      true, false, '2025-11-20T11:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Shopping'),    'over_budget',       'Shopping budget exceeded! You spent £220.00 of your £200.00 budget.',    true, true,  '2025-12-08T13:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Gifts'),       'over_budget',       'Gifts budget exceeded! You spent £250.00 of your £150.00 budget.',      true, false, '2025-12-15T17:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Groceries'),   'threshold_warning', 'Groceries spending is at 84% of your £350.00 budget.',                 false, false, '2026-02-22T10:00:00Z'),
  ('e4ad5e39-aeb9-4f5b-a8cf-c75a89a834ea', bdgt('Dining Out'),  'threshold_warning', 'Dining Out spending is at 83% of your £200.00 budget.',                false, false, '2026-02-14T20:00:00Z');

-- Clean up helper functions
DROP FUNCTION IF EXISTS cat(text);
DROP FUNCTION IF EXISTS acct(text);
DROP FUNCTION IF EXISTS bdgt(text);