'use server';

import { db } from '@/index';
import { categoriesTable, defaultCategoryTemplatesTable, userOnboardingTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/auth';

async function upsertOnboardingState(userId: string, updates: Partial<{
  use_default_categories: boolean;
  completed: boolean;
  completed_at: Date | null;
}>) {
  await db.insert(userOnboardingTable).values({
    user_id: userId,
    use_default_categories: updates.use_default_categories ?? false,
    completed: updates.completed ?? false,
    completed_at: updates.completed_at ?? null,
  }).onConflictDoUpdate({
    target: userOnboardingTable.user_id,
    set: updates,
  });
}

async function insertMissingDefaultCategories(userId: string) {
  const templates = await db.select()
    .from(defaultCategoryTemplatesTable)
    .where(eq(defaultCategoryTemplatesTable.is_active, true));

  if (templates.length === 0) {
    return;
  }

  const existingCategories = await db.select({ name: categoriesTable.name })
    .from(categoriesTable)
    .where(eq(categoriesTable.user_id, userId));

  const existingNames = new Set(existingCategories.map((category) => category.name.toLowerCase()));
  const rowsToInsert = templates
    .filter((template) => !existingNames.has(template.name.toLowerCase()))
    .map((template) => ({
      user_id: userId,
      name: template.name,
      color: template.color,
      icon: template.icon,
    }));

  if (rowsToInsert.length > 0) {
    await db.insert(categoriesTable).values(rowsToInsert);
  }
}

export async function continueFromCategories(formData: FormData) {
  const userId = await getCurrentUserId();
  const useDefaultCategories = formData.get('use_default_categories') === 'on';
  const intent = formData.get('intent');

  await upsertOnboardingState(userId, {
    use_default_categories: useDefaultCategories,
    completed: false,
    completed_at: null,
  });

  if (useDefaultCategories) {
    await insertMissingDefaultCategories(userId);
  }

  revalidatePath('/onboarding');
  if (intent === 'apply') {
    redirect('/onboarding?step=categories');
  }

  redirect('/onboarding?step=budgets');
}

export async function completeOnboarding() {
  const userId = await getCurrentUserId();

  await upsertOnboardingState(userId, {
    completed: true,
    completed_at: new Date(),
  });

  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function skipOnboarding() {
  const userId = await getCurrentUserId();

  await upsertOnboardingState(userId, {
    use_default_categories: false,
    completed: true,
    completed_at: new Date(),
  });

  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
