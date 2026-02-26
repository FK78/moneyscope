'use server';

import { db } from '@/index';
import { accountsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function addAccount(formData: FormData) {
  const [result] = await db.insert(accountsTable).values({
    user_id: 1,
    name: formData.get('name') as string,
    type: formData.get('type') as 'checking' | 'savings' | 'credit_card' | 'investment',
    balance: parseFloat(formData.get('balance') as string),
    currency: (formData.get('currency') as string) || 'USD',
  }).returning({ id: accountsTable.id });
  revalidatePath('/dashboard/accounts');
  return result;
}
