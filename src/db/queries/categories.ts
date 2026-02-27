import { db } from '@/index';
import { categoriesTable } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function getCategoriesByUser(userId: string | number) {
  return await db.select()
    .from(categoriesTable)
    .where(sql`${categoriesTable.user_id}::text = ${userId}`);
}
