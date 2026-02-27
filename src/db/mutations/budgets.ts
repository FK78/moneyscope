'use server';

import { db } from '@/index';
import { budgetsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function addBudget(formData: FormData) {
  const [result] = await db.insert(budgetsTable).values({
    user_id: 1,
    category_id: Number(formData.get('category_id')),
    amount: parseFloat(formData.get('amount') as string),
    period: formData.get('period') as 'monthly' | 'weekly',
    start_date: formData.get('start_date') as string,
  }).returning({ id: budgetsTable.id });
  revalidatePath('/dashboard/budgets');
  return result;
}
