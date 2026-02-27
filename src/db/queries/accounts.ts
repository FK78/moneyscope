import { db } from '@/index'; // you'll create this shared db instance
import { transactionsTable, accountsTable } from '@/db/schema';
import { eq, count, sql } from 'drizzle-orm';

export async function getAccountsWithDetails(userId: string | number) {
  return await db.select({
    id: accountsTable.id,
    accountName: accountsTable.name,
    type: accountsTable.type,
    balance: accountsTable.balance,
    currency: accountsTable.currency,
    transactions: count(transactionsTable.id),
  })
    .from(accountsTable)
    .leftJoin(transactionsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(sql`${accountsTable.user_id}::text = ${userId}`)
    .groupBy(accountsTable.id, accountsTable.name, accountsTable.type, accountsTable.balance, accountsTable.currency);
}
