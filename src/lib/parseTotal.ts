export function parseTotal(rows: { total: string | null }[]) {
  return Number(rows.at(0)?.total ?? 0);
}