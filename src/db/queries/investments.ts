"use server";

import { db } from "@/index";
import { trading212ConnectionsTable, manualHoldingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";
import { searchTicker } from "@/lib/yahoo-finance";

export async function searchTickers(query: string) {
  await getCurrentUserId();
  if (!query || query.length < 1) return [];
  return searchTicker(query);
}

export async function getTrading212Connection(userId: string) {
  const rows = await db
    .select()
    .from(trading212ConnectionsTable)
    .where(eq(trading212ConnectionsTable.user_id, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getManualHoldings(userId: string) {
  return db
    .select()
    .from(manualHoldingsTable)
    .where(eq(manualHoldingsTable.user_id, userId));
}
