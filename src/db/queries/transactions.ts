import { db } from '@/index';
import { transactionsTable, categoriesTable, accountsTable } from '@/db/schema';
import { and, desc, eq, ne, sum, gte, lt, sql } from 'drizzle-orm';

function getMonthRange(monthsAgo = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

const transactionSelect = {
  id: transactionsTable.id,
  accountName: accountsTable.name,
  account_id: transactionsTable.account_id,
  type: transactionsTable.type,
  amount: transactionsTable.amount,
  category: categoriesTable.name,
  category_id: transactionsTable.category_id,
  description: transactionsTable.description,
  date: transactionsTable.date,
  is_recurring: transactionsTable.is_recurring,
};

function baseTransactionsQuery(userId: string | number) {
  return db.select(transactionSelect)
    .from(transactionsTable)
    .innerJoin(categoriesTable, eq(transactionsTable.category_id, categoriesTable.id))
    .innerJoin(accountsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(sql`${accountsTable.user_id}::text = ${userId}`)
    .$dynamic();
}

export async function getTransactionsWithDetails(userId: string | number) {
  return await baseTransactionsQuery(userId).orderBy(desc(transactionsTable.date));
}

export async function getLatestFiveTransactionsWithDetails(userId: string | number) {
  return await baseTransactionsQuery(userId)
    .orderBy(desc(transactionsTable.date))
    .limit(5);
}

function getTotalByType(userId: string | number, type: 'income' | 'expense', monthsAgo = 0) {
  const { start, end } = getMonthRange(monthsAgo);
  return db.select({ total: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(
      and(
        sql`${accountsTable.user_id}::text = ${userId}`,
        eq(transactionsTable.type, type),
        gte(transactionsTable.date, start),
        lt(transactionsTable.date, end)
      )
    );
}

export async function getTotalIncomeOfTransactionsThisMonth(userId: string | number) {
  return await getTotalByType(userId, 'income');
}

export async function getTotalExpensesOfTransactionsThisMonth(userId: string | number) {
  return await getTotalByType(userId, 'expense');
}

export async function getTotalIncomeLastMonth(userId: string | number) {
  return await getTotalByType(userId, 'income', 1);
}

export async function getTotalExpensesLastMonth(userId: string | number) {
  return await getTotalByType(userId, 'expense', 1);
}

function getSavingsDeposits(userId: string | number, monthsAgo = 0) {
  const { start, end } = getMonthRange(monthsAgo);
  return db.select({ total: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(
      and(
        sql`${accountsTable.user_id}::text = ${userId}`,
        eq(accountsTable.type, 'savings'),
        gte(transactionsTable.date, start),
        lt(transactionsTable.date, end)
      )
    );
}

export async function getSavingsDepositsThisMonth(userId: string | number) {
  return await getSavingsDeposits(userId);
}

export async function getSavingsDepositsLastMonth(userId: string | number) {
  return await getSavingsDeposits(userId, 1);
}

export async function getTotalSpendByCategoryThisMonth(userId: string | number){
  const { start, end } = getMonthRange();

  return await db.select({
    category: categoriesTable.name,
    total: sum(transactionsTable.amount),
    color: categoriesTable.color
  }).from(transactionsTable)
    .innerJoin(categoriesTable, eq(transactionsTable.category_id, categoriesTable.id))
    .innerJoin(accountsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(and(
      sql`${accountsTable.user_id}::text = ${userId}`,
      eq(transactionsTable.type, 'expense'),
      ne(categoriesTable.name, 'Salary'),
      gte(transactionsTable.date, start),
      lt(transactionsTable.date, end)
    ))
    .groupBy(categoriesTable.name, categoriesTable.color);
}
