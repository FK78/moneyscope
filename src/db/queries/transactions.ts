import { db } from '@/index'; // you'll create this shared db instance
import { transactionsTable, categoriesTable, accountsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getTransactionsWithDetails(userId: number) {
  return await db.select({
    id: transactionsTable.id,
    accountName: accountsTable.name,
    type: transactionsTable.type,
    amount: transactionsTable.amount,
    category: categoriesTable.name,
    description: transactionsTable.description,
    date: transactionsTable.date,
    is_recurring: transactionsTable.is_recurring,
  })
    .from(transactionsTable)
    .innerJoin(categoriesTable, eq(transactionsTable.category_id, categoriesTable.id))
    .innerJoin(accountsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(eq(accountsTable.user_id, userId));
}