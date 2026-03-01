// DEPRECATED: Use getTotalsByType which returns a number directly.
// This file can be safely deleted.
export function parseTotal(rows: { total: string | null }[]) {
  return Number(rows.at(0)?.total ?? 0);
}