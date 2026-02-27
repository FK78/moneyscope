'use server';

import { db } from '@/index';
import { accountsTable, transactionsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/auth';
import { checkBudgetAlerts } from '@/lib/budget-alerts';
import { matchCategorisationRule } from '@/lib/auto-categorise';

type Transaction = typeof transactionsTable.$inferInsert;
type RecurringPattern = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

function computeNextRecurringDate(dateStr: string, pattern: string | null): string | null {
  if (!pattern) return null;
  const d = new Date(dateStr + 'T00:00:00');
  switch (pattern as RecurringPattern) {
    case 'daily': d.setDate(d.getDate() + 1); break;
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'biweekly': d.setDate(d.getDate() + 14); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
    default: return null;
  }
  return d.toISOString().split('T')[0];
}

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

  const isRecurring = formData.get('is_recurring') === 'true';
  const recurringPattern = isRecurring ? (formData.get('recurring_pattern') as string | null) : null;
  const txnDate = formData.get('date') as string;
  const nextRecurringDate = isRecurring && recurringPattern && txnDate
    ? computeNextRecurringDate(txnDate, recurringPattern)
    : null;

  const description = formData.get('description') as string;
  let categoryId = Number(formData.get('category_id'));

  // Auto-categorise if no category was selected
  if (!categoryId) {
    const userId = await getCurrentUserId();
    const matched = await matchCategorisationRule(userId, description);
    if (matched) categoryId = matched;
  }

  const [result] = await createTransaction({
    type,
    amount,
    description,
    is_recurring: isRecurring,
    date: txnDate,
    account_id: accountId,
    category_id: categoryId || Number(formData.get('category_id')),
    recurring_pattern: recurringPattern as typeof transactionsTable.$inferInsert['recurring_pattern'],
    next_recurring_date: nextRecurringDate,
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

  const isRecurring = formData.get('is_recurring') === 'true';
  const recurringPattern = isRecurring ? (formData.get('recurring_pattern') as string | null) : null;
  const txnDate = formData.get('date') as string;
  const nextRecurringDate = isRecurring && recurringPattern && txnDate
    ? computeNextRecurringDate(txnDate, recurringPattern)
    : null;

  const [result] = await db.update(transactionsTable).set({
    type: newType,
    amount: newAmount,
    description: formData.get('description') as string,
    is_recurring: isRecurring,
    date: txnDate,
    account_id: newAccountId,
    category_id: Number(formData.get('category_id')),
    recurring_pattern: recurringPattern as typeof transactionsTable.$inferInsert['recurring_pattern'],
    next_recurring_date: nextRecurringDate,
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