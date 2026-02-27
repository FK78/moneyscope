import { db } from '@/index';
import { defaultCategoryTemplatesTable, userOnboardingTable } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function getOnboardingState(userId: string) {
  const [row] = await db.select()
    .from(userOnboardingTable)
    .where(eq(userOnboardingTable.user_id, userId))
    .limit(1);

  return row ?? null;
}

export async function hasCompletedOnboarding(userId: string) {
  const state = await getOnboardingState(userId);
  return state?.completed === true;
}

export async function getDefaultCategoryTemplates() {
  return await db.select()
    .from(defaultCategoryTemplatesTable)
    .where(eq(defaultCategoryTemplatesTable.is_active, true))
    .orderBy(asc(defaultCategoryTemplatesTable.sort_order), asc(defaultCategoryTemplatesTable.id));
}
