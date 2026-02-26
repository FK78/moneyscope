-- Users
INSERT INTO users (email, name, currency) VALUES
  ('alice@example.com', 'Alice Johnson', 'USD'),
  ('bob@example.com', 'Bob Smith', 'USD'),
  ('carol@example.com', 'Carol Williams', 'GBP');

-- Accounts
INSERT INTO accounts (user_id, name, type, balance, currency) VALUES
  (1, 'Main Checking', 'checking', 4250.00, 'USD'),
  (1, 'Savings', 'savings', 12000.00, 'USD'),
  (1, 'Visa Card', 'credit_card', -820.50, 'USD'),
  (2, 'Daily Checking', 'checking', 3100.00, 'USD'),
  (2, 'Investment Portfolio', 'investment', 25000.00, 'USD'),
  (3, 'Current Account', 'checking', 5600.00, 'GBP');

-- Categories
INSERT INTO categories (user_id, name, color, icon, is_default) VALUES
  (1, 'Groceries', '#4CAF50', 'shopping-cart', true),
  (1, 'Rent', '#F44336', 'home', true),
  (1, 'Salary', '#2196F3', 'briefcase', true),
  (1, 'Dining Out', '#FF9800', 'utensils', false),
  (1, 'Transport', '#9C27B0', 'car', false),
  (1, 'Utilities', '#607D8B', 'zap', true),
  (2, 'Groceries', '#4CAF50', 'shopping-cart', true),
  (2, 'Salary', '#2196F3', 'briefcase', true),
  (2, 'Entertainment', '#E91E63', 'film', false),
  (3, 'Groceries', '#4CAF50', 'shopping-cart', true),
  (3, 'Salary', '#2196F3', 'briefcase', true);

-- January transactions for Alice (user 1)
INSERT INTO transactions (account_id, category_id, type, amount, description, date, is_recurring, recurring_pattern) VALUES
  (1, 3, 'income', 3500.00, 'Monthly salary', '2026-01-01', true, 'monthly'),
  (1, 1, 'expense', 72.60, 'Whole Foods groceries', '2026-01-04', false, NULL),
  (1, 4, 'expense', 38.00, 'Dinner at Chilis', '2026-01-06', false, NULL),
  (1, 5, 'expense', 22.00, 'Lyft to downtown', '2026-01-07', false, NULL),
  (3, 1, 'expense', 58.90, 'Trader Joes weekly shop', '2026-01-10', false, NULL),
  (1, 6, 'expense', 115.00, 'Electric bill', '2026-01-11', true, 'monthly'),
  (1, 2, 'expense', 1800.00, 'January rent', '2026-01-01', true, 'monthly'),
  (1, 4, 'expense', 24.00, 'Coffee and pastries', '2026-01-14', false, NULL),
  (1, 5, 'expense', 48.00, 'Gas station fill-up', '2026-01-16', false, NULL),
  (1, 1, 'expense', 105.20, 'Costco bulk shopping', '2026-01-18', false, NULL),
  (1, 6, 'expense', 75.00, 'Internet bill', '2026-01-20', true, 'monthly'),
  (2, 3, 'income', 350.00, 'Freelance payment', '2026-01-22', false, NULL),
  (2, 3, 'income', 400.00, 'Transfer to savings', '2026-01-25', false, NULL),

-- January transactions for Bob (user 2)
  (4, 8, 'income', 4200.00, 'Bi-weekly paycheck', '2026-01-01', true, 'monthly'),
  (4, 7, 'expense', 95.00, 'Weekly groceries', '2026-01-05', false, NULL),
  (4, 9, 'expense', 18.99, 'Netflix + Spotify', '2026-01-06', true, 'monthly'),
  (4, 7, 'expense', 40.00, 'Farmers market', '2026-01-12', false, NULL),
  (4, 8, 'income', 4200.00, 'Bi-weekly paycheck', '2026-01-15', true, 'monthly'),
  (4, 7, 'expense', 88.50, 'Grocery haul', '2026-01-19', false, NULL),

-- January transactions for Carol (user 3)
  (6, 11, 'income', 3200.00, 'Monthly salary', '2026-01-01', true, 'monthly'),
  (6, 10, 'expense', 65.00, 'Tesco weekly shop', '2026-01-03', false, NULL),
  (6, 10, 'expense', 48.70, 'Sainsburys groceries', '2026-01-10', false, NULL),
  (6, 10, 'expense', 59.80, 'Waitrose shop', '2026-01-17', false, NULL);

-- February transactions for Alice (user 1)
INSERT INTO transactions (account_id, category_id, type, amount, description, date, is_recurring, recurring_pattern) VALUES
  (1, 3, 'income', 3500.00, 'Monthly salary', '2026-02-01', true, 'monthly'),
  (1, 1, 'expense', 85.40, 'Whole Foods groceries', '2026-02-03', false, NULL),
  (1, 4, 'expense', 42.00, 'Dinner at Olive Garden', '2026-02-05', false, NULL),
  (1, 5, 'expense', 15.00, 'Uber ride to airport', '2026-02-06', false, NULL),
  (3, 1, 'expense', 63.20, 'Trader Joes weekly shop', '2026-02-08', false, NULL),
  (1, 6, 'expense', 120.00, 'Electric bill', '2026-02-10', true, 'monthly'),
  (1, 2, 'expense', 1800.00, 'February rent', '2026-02-01', true, 'monthly'),
  (1, 4, 'expense', 28.50, 'Coffee and brunch', '2026-02-12', false, NULL),
  (1, 5, 'expense', 55.00, 'Gas station fill-up', '2026-02-14', false, NULL),
  (1, 1, 'expense', 97.30, 'Costco bulk shopping', '2026-02-15', false, NULL),
  (3, 4, 'expense', 35.00, 'Sushi takeout', '2026-02-17', false, NULL),
  (1, 6, 'expense', 75.00, 'Internet bill', '2026-02-18', true, 'monthly'),
  (2, 3, 'income', 500.00, 'Freelance payment', '2026-02-19', false, NULL),
  (2, 3, 'income', 600.00, 'Transfer to savings', '2026-02-20', false, NULL),

-- Transactions for Bob (user 2)
  (4, 8, 'income', 4200.00, 'Bi-weekly paycheck', '2026-02-01', true, 'monthly'),
  (4, 7, 'expense', 110.50, 'Weekly groceries', '2026-02-04', false, NULL),
  (4, 9, 'expense', 18.99, 'Netflix + Spotify', '2026-02-05', true, 'monthly'),
  (4, 7, 'expense', 45.80, 'Farmers market', '2026-02-10', false, NULL),
  (4, 9, 'expense', 65.00, 'Concert tickets', '2026-02-13', false, NULL),
  (4, 8, 'income', 4200.00, 'Bi-weekly paycheck', '2026-02-15', true, 'monthly'),
  (4, 7, 'expense', 92.00, 'Grocery haul', '2026-02-18', false, NULL),

-- Transactions for Carol (user 3)
  (6, 11, 'income', 3200.00, 'Monthly salary', '2026-02-01', true, 'monthly'),
  (6, 10, 'expense', 78.50, 'Tesco weekly shop', '2026-02-02', false, NULL),
  (6, 10, 'expense', 55.30, 'Sainsburys groceries', '2026-02-09', false, NULL),
  (6, 10, 'expense', 62.10, 'Waitrose shop', '2026-02-16', false, NULL);

-- Budgets for Alice (user 1)
-- category_ids: 1=Groceries, 2=Rent, 3=Salary, 4=Dining Out, 5=Transport, 6=Utilities
INSERT INTO budgets (user_id, category_id, amount, period, start_date) VALUES
  (1, 1, 400.00, 'monthly', '2026-02-01'),
  (1, 2, 1800.00, 'monthly', '2026-02-01'),
  (1, 4, 200.00, 'monthly', '2026-02-01'),
  (1, 5, 150.00, 'monthly', '2026-02-01'),
  (1, 6, 250.00, 'monthly', '2026-02-01'),

-- Budgets for Bob (user 2)
-- category_ids: 7=Groceries, 8=Salary, 9=Entertainment
  (2, 7, 350.00, 'monthly', '2026-02-01'),
  (2, 9, 100.00, 'monthly', '2026-02-01'),

-- Budgets for Carol (user 3)
-- category_ids: 10=Groceries, 11=Salary
  (3, 10, 300.00, 'weekly', '2026-02-01');
