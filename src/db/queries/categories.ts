import { db } from '@/index';
import { categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getCategoriesByUser(userId: string) {
  return await db.select()
    .from(categoriesTable)
    .where(eq(categoriesTable.user_id, userId));
}
