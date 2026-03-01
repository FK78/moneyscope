import type { MonthlyCashflowPoint, MonthlyCategorySpendPoint } from "@/db/queries/transactions";
import { formatCurrency } from "@/lib/formatCurrency";
import { getMonthKey } from "@/lib/date";

export type Insight = {
  type: "spike" | "drop" | "streak" | "info" | "warning";
  message: string;
  category?: string;
};

/**
 * Generates spending insights by comparing the current month against
 * a 3-month rolling average per category, plus overall trends.
 */
export function generateInsights(
  monthlyTrend: MonthlyCashflowPoint[],
  categoryTrend: MonthlyCategorySpendPoint[],
  currency: string,
): Insight[] {
  const insights: Insight[] = [];
  const currentMonthKey = getMonthKey(new Date());

  // --- Overall income/expense insights ---
  addOverallInsights(insights, monthlyTrend, currentMonthKey, currency);

  // --- Per-category anomalies ---
  addCategoryInsights(insights, categoryTrend, currentMonthKey, currency);

  // --- Consecutive spending increase detection ---
  addStreakInsights(insights, monthlyTrend, currentMonthKey);

  // Sort: warnings/spikes first, then drops, then info
  const priority: Record<Insight["type"], number> = {
    warning: 0,
    spike: 1,
    drop: 2,
    streak: 3,
    info: 4,
  };
  insights.sort((a, b) => priority[a.type] - priority[b.type]);

  return insights.slice(0, 6);
}

function addOverallInsights(
  insights: Insight[],
  monthlyTrend: MonthlyCashflowPoint[],
  currentMonthKey: string,
  currency: string,
) {
  const currentMonth = monthlyTrend.find((m) => m.month === currentMonthKey);
  const priorMonths = monthlyTrend.filter((m) => m.month < currentMonthKey);

  if (!currentMonth || priorMonths.length === 0) return;

  // Average of prior months
  const avgExpenses = priorMonths.reduce((s, m) => s + m.expenses, 0) / priorMonths.length;
  const avgIncome = priorMonths.reduce((s, m) => s + m.income, 0) / priorMonths.length;

  // Spending vs average
  if (avgExpenses > 0 && currentMonth.expenses > 0) {
    const pctChange = ((currentMonth.expenses - avgExpenses) / avgExpenses) * 100;
    if (pctChange >= 20) {
      insights.push({
        type: "warning",
        message: `Total spending is up ${Math.round(pctChange)}% vs your ${priorMonths.length}-month average (${formatCurrency(avgExpenses, currency)}/mo)`,
      });
    } else if (pctChange <= -15) {
      insights.push({
        type: "drop",
        message: `Total spending is down ${Math.abs(Math.round(pctChange))}% vs your ${priorMonths.length}-month average — nice work`,
      });
    }
  }

  // Income vs average
  if (avgIncome > 0 && currentMonth.income > 0) {
    const pctChange = ((currentMonth.income - avgIncome) / avgIncome) * 100;
    if (pctChange >= 20) {
      insights.push({
        type: "info",
        message: `Income is up ${Math.round(pctChange)}% compared to your recent average`,
      });
    } else if (pctChange <= -20) {
      insights.push({
        type: "warning",
        message: `Income is down ${Math.abs(Math.round(pctChange))}% compared to your recent average`,
      });
    }
  }

  // Savings rate
  if (currentMonth.income > 0) {
    const savingsRate = ((currentMonth.income - currentMonth.expenses) / currentMonth.income) * 100;
    if (savingsRate >= 30) {
      insights.push({
        type: "info",
        message: `You're saving ${Math.round(savingsRate)}% of your income this month — excellent`,
      });
    } else if (savingsRate < 0) {
      insights.push({
        type: "warning",
        message: `You're spending more than you earn this month (${Math.abs(Math.round(savingsRate))}% over)`,
      });
    }
  }
}

function addCategoryInsights(
  insights: Insight[],
  categoryTrend: MonthlyCategorySpendPoint[],
  currentMonthKey: string,
  currency: string,
) {
  // Group by category
  const byCategory = new Map<string, Map<string, number>>();
  for (const row of categoryTrend) {
    if (!byCategory.has(row.category)) {
      byCategory.set(row.category, new Map());
    }
    byCategory.get(row.category)!.set(row.month, row.total);
  }

  // For each category, compare current month to prior-month average
  const anomalies: { category: string; pctChange: number; current: number; avg: number }[] = [];

  for (const [category, monthMap] of byCategory) {
    const currentTotal = monthMap.get(currentMonthKey) ?? 0;
    const priorTotals: number[] = [];

    for (const [month, total] of monthMap) {
      if (month < currentMonthKey) {
        priorTotals.push(total);
      }
    }

    if (priorTotals.length === 0 || currentTotal === 0) continue;

    const avg = priorTotals.reduce((s, v) => s + v, 0) / priorTotals.length;
    if (avg === 0) continue;

    const pctChange = ((currentTotal - avg) / avg) * 100;
    anomalies.push({ category, pctChange, current: currentTotal, avg });
  }

  // Sort by absolute change — biggest anomalies first
  anomalies.sort((a, b) => Math.abs(b.pctChange) - Math.abs(a.pctChange));

  // Take the top anomalies (at least 25% change)
  for (const a of anomalies.slice(0, 3)) {
    if (a.pctChange >= 25) {
      insights.push({
        type: "spike",
        category: a.category,
        message: `${a.category} spending is up ${Math.round(a.pctChange)}% (${formatCurrency(a.current, currency)} vs ${formatCurrency(a.avg, currency)} avg)`,
      });
    } else if (a.pctChange <= -25) {
      insights.push({
        type: "drop",
        category: a.category,
        message: `${a.category} spending is down ${Math.abs(Math.round(a.pctChange))}% (${formatCurrency(a.current, currency)} vs ${formatCurrency(a.avg, currency)} avg)`,
      });
    }
  }

  // Biggest category this month
  const currentMonthCategories = [...byCategory.entries()]
    .map(([cat, monthMap]) => ({ category: cat, total: monthMap.get(currentMonthKey) ?? 0 }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  if (currentMonthCategories.length > 0) {
    const top = currentMonthCategories[0];
    insights.push({
      type: "info",
      category: top.category,
      message: `Biggest expense this month: ${top.category} at ${formatCurrency(top.total, currency)}`,
    });
  }
}

function addStreakInsights(
  insights: Insight[],
  monthlyTrend: MonthlyCashflowPoint[],
  currentMonthKey: string,
) {
  // Check for consecutive months where expenses increased
  const sorted = [...monthlyTrend]
    .filter((m) => m.month <= currentMonthKey)
    .sort((a, b) => a.month.localeCompare(b.month));

  let streak = 0;
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i].expenses > sorted[i - 1].expenses && sorted[i - 1].expenses > 0) {
      streak++;
    } else {
      break;
    }
  }

  if (streak >= 3) {
    insights.push({
      type: "streak",
      message: `Spending has increased for ${streak} consecutive months`,
    });
  }
}
