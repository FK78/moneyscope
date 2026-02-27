import { db } from '@/index'; // you'll create this shared db instance
import { transactionsTable, accountsTable, budgetsTable, categoriesTable } from '@/db/schema';
import { eq, sum, and, sql } from 'drizzle-orm';

export async function getBudgets(userId: number) {
  return await db.select({
    id: budgetsTable.id,
    category_id: budgetsTable.category_id,
    budgetCategory: categoriesTable.name,
    budgetColor: categoriesTable.color,
    budgetAmount: budgetsTable.amount,
    budgetSpent: sql<number>`coalesce(${sum(transactionsTable.amount)}, 0)`.mapWith(Number),
    budgetPeriod: budgetsTable.period,
    start_date: budgetsTable.start_date,
  })
    .from(budgetsTable)
    .innerJoin(categoriesTable, eq(categoriesTable.id, budgetsTable.category_id))
    .leftJoin(transactionsTable, eq(transactionsTable.category_id, budgetsTable.category_id))
    .where(eq(budgetsTable.user_id, userId))
    .groupBy(budgetsTable.id, budgetsTable.category_id, categoriesTable.name, categoriesTable.color, budgetsTable.amount, budgetsTable.period, budgetsTable.start_date);
}