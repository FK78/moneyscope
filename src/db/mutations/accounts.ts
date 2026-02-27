'use server';

import { db } from '@/index';
import { accountsTable, transactionsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId } from '@/lib/auth';

export async function addAccount(formData: FormData) {
  const userId = await getCurrentUserId();

  const [result] = await db.insert(accountsTable).values({
    user_id: userId,
    name: formData.get('name') as string,
    type: formData.get('type') as 'checking' | 'savings' | 'credit_card' | 'investment',
    balance: parseFloat(formData.get('balance') as string),
    currency: (formData.get('currency') as string) || 'USD',
  }).returning({ id: accountsTable.id });
  revalidatePath('/onboarding');
  revalidatePath('/dashboard/accounts');
  return result;
}

export async function editAccount(id: number, formData: FormData) {
  await db.update(accountsTable).set({
    name: formData.get('name') as string,
    type: formData.get('type') as 'checking' | 'savings' | 'credit_card' | 'investment',
    balance: parseFloat(formData.get('balance') as string),
    currency: (formData.get('currency') as string) || 'USD',
  }).where(eq(accountsTable.id, id));
  revalidatePath('/dashboard/accounts');
}

export async function deleteAccount(id: number) {
  await db.delete(transactionsTable).where(eq(transactionsTable.account_id, id));
  await db.delete(accountsTable).where(eq(accountsTable.id, id));
  revalidatePath('/dashboard/accounts');
}
