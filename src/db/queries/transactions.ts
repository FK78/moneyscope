import { db } from '@/index';
import { transactionsTable, categoriesTable, accountsTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

const transactionSelect = {
  id: transactionsTable.id,
  accountName: accountsTable.name,
  type: transactionsTable.type,
  amount: transactionsTable.amount,
  category: categoriesTable.name,
  description: transactionsTable.description,
  date: transactionsTable.date,
  is_recurring: transactionsTable.is_recurring,
};

function baseTransactionsQuery(userId: number) {
  return db.select(transactionSelect)
    .from(transactionsTable)
    .innerJoin(categoriesTable, eq(transactionsTable.category_id, categoriesTable.id))
    .innerJoin(accountsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(eq(accountsTable.user_id, userId));
}

export async function getTransactionsWithDetails(userId: number) {
  return await baseTransactionsQuery(userId);
}

export async function getLatestFiveTransactionsWithDetails(userId: number) {
  return await baseTransactionsQuery(userId)
    .orderBy(desc(transactionsTable.date))
    .limit(5);
}