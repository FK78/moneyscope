'use server';

import { db } from '@/index';
import { budgetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

export async function editBudget(id: number, formData: FormData) {
  await db.update(budgetsTable).set({
    category_id: Number(formData.get('category_id')),
    amount: parseFloat(formData.get('amount') as string),
    period: formData.get('period') as 'monthly' | 'weekly',
    start_date: formData.get('start_date') as string,
  }).where(eq(budgetsTable.id, id));
  revalidatePath('/dashboard/budgets');
}

export async function deleteBudget(id: number) {
  await db.delete(budgetsTable).where(eq(budgetsTable.id, id));
  revalidatePath('/dashboard/budgets');
}
