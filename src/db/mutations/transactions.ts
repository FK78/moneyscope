'use server';

import { db } from '@/index';
import { transactionsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

type Transaction = typeof transactionsTable.$inferInsert;

export async function createTransaction(transaction: Transaction) {
  return await db.insert(transactionsTable).values(transaction).returning({ id: transactionsTable.id });
}

export async function addTransaction(formData: FormData) {
  const [result] = await createTransaction({
    type: formData.get('type') as 'income' | 'expense',
    amount: parseFloat(formData.get('amount') as string),
    description: formData.get('description') as string,
    is_recurring: formData.get('is_recurring') === 'true',
    date: formData.get('date') as string,
    account_id: Number(formData.get('account_id')),
    category_id: Number(formData.get('category_id')),
    recurring_pattern: formData.get('recurring_pattern') as string | null,
  });
  revalidatePath('/dashboard/transactions');
  return result;
}

export async function editTransaction(formData: FormData) {
  const id = Number(formData.get('id'));
  const [result] = await db.update(transactionsTable).set({
    type: formData.get('type') as 'income' | 'expense',
    amount: parseFloat(formData.get('amount') as string),
    description: formData.get('description') as string,
    is_recurring: formData.get('is_recurring') === 'true',
    date: formData.get('date') as string,
    account_id: Number(formData.get('account_id')),
    category_id: Number(formData.get('category_id')),
    recurring_pattern: formData.get('recurring_pattern') as string | null,
  }).where(eq(transactionsTable.id, id)).returning({ id: transactionsTable.id });
  revalidatePath('/dashboard/transactions');
  return result;
}