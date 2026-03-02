import { db } from '@/index'; // you'll create this shared db instance
import { transactionsTable, accountsTable } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { decrypt } from '@/lib/encryption';

export async function getAccountsWithDetails(userId: string) {
  const rows = await db.select({
    id: accountsTable.id,
    accountName: accountsTable.name,
    type: accountsTable.type,
    balance: accountsTable.balance,
    transactions: count(transactionsTable.id),
  })
    .from(accountsTable)
    .leftJoin(transactionsTable, eq(transactionsTable.account_id, accountsTable.id))
    .where(eq(accountsTable.user_id, userId))
    .groupBy(accountsTable.id, accountsTable.name, accountsTable.type, accountsTable.balance);
  return rows.map(row => ({ ...row, accountName: decrypt(row.accountName) }));
}
