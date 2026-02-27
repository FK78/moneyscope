'use server';

import { db } from '@/index';
import { accountsTable, transactionsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/auth';
import { checkBudgetAlerts } from '@/lib/budget-alerts';

type Transaction = typeof transactionsTable.$inferInsert;

export async function createTransaction(transaction: Transaction) {
  return await db.insert(transactionsTable).values(transaction).returning({ id: transactionsTable.id });
}

function balanceDelta(type: 'income' | 'expense', amount: number) {
  return type === 'income' ? amount : -amount;
}

export async function addTransaction(formData: FormData) {
  const type = formData.get('type') as 'income' | 'expense';
  const amount = parseFloat(formData.get('amount') as string);
  const accountId = Number(formData.get('account_id'));

  const [result] = await createTransaction({
    type,
    amount,
    description: formData.get('description') as string,
    is_recurring: formData.get('is_recurring') === 'true',
    date: formData.get('date') as string,
    account_id: accountId,
    category_id: Number(formData.get('category_id')),
    recurring_pattern: formData.get('recurring_pattern') as string | null,
  });

  await db.update(accountsTable)
    .set({ balance: sql`${accountsTable.balance} + ${balanceDelta(type, amount)}` })
    .where(eq(accountsTable.id, accountId));

  revalidatePath('/dashboard/transactions');
  revalidatePath('/dashboard/accounts');

  const userId = await getCurrentUserId();
  await checkBudgetAlerts(userId);

  return result;
}

export async function editTransaction(formData: FormData) {
  const id = Number(formData.get('id'));
  const newType = formData.get('type') as 'income' | 'expense';
  const newAmount = parseFloat(formData.get('amount') as string);
  const newAccountId = Number(formData.get('account_id'));

  // Fetch old transaction to reverse its balance effect
  const [old] = await db.select({
    type: transactionsTable.type,
    amount: transactionsTable.amount,
    account_id: transactionsTable.account_id,
  }).from(transactionsTable).where(eq(transactionsTable.id, id));

  const [result] = await db.update(transactionsTable).set({
    type: newType,
    amount: newAmount,
    description: formData.get('description') as string,
    is_recurring: formData.get('is_recurring') === 'true',
    date: formData.get('date') as string,
    account_id: newAccountId,
    category_id: Number(formData.get('category_id')),
    recurring_pattern: formData.get('recurring_pattern') as string | null,
  }).where(eq(transactionsTable.id, id)).returning({ id: transactionsTable.id });

  if (old) {
    // Reverse old effect
    if (old.account_id) {
      await db.update(accountsTable)
        .set({ balance: sql`${accountsTable.balance} - ${balanceDelta(old.type, old.amount)}` })
        .where(eq(accountsTable.id, old.account_id));
    }
    // Apply new effect
    await db.update(accountsTable)
      .set({ balance: sql`${accountsTable.balance} + ${balanceDelta(newType, newAmount)}` })
      .where(eq(accountsTable.id, newAccountId));
  }

  revalidatePath('/dashboard/transactions');
  revalidatePath('/dashboard/accounts');

  const userId = await getCurrentUserId();
  await checkBudgetAlerts(userId);

  return result;
}

export async function deleteTransaction(id: number) {
  // Fetch transaction to reverse its balance effect
  const [txn] = await db.select({
    type: transactionsTable.type,
    amount: transactionsTable.amount,
    account_id: transactionsTable.account_id,
  }).from(transactionsTable).where(eq(transactionsTable.id, id));

  await db.delete(transactionsTable).where(eq(transactionsTable.id, id));

  if (txn?.account_id) {
    await db.update(accountsTable)
      .set({ balance: sql`${accountsTable.balance} - ${balanceDelta(txn.type, txn.amount)}` })
      .where(eq(accountsTable.id, txn.account_id));
  }

  revalidatePath('/dashboard/transactions');
  revalidatePath('/dashboard/accounts');
}