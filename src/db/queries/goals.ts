import { db } from '@/index';
import { goalsTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getGoals(userId: string) {
  return await db.select()
    .from(goalsTable)
    .where(eq(goalsTable.user_id, userId))
    .orderBy(desc(goalsTable.created_at));
}
