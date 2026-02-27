"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type MonthlyCashflowPoint } from "@/db/queries/transactions";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

function formatMonthLabel(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(year, (monthIndex ?? 1) - 1, 1);
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

function formatCompactCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function CashflowCharts({
  data,
  currency,
}: {
  data: MonthlyCashflowPoint[];
  currency: string;
}) {
  const chartData = data.map((point) => ({
    ...point,
    monthLabel: formatMonthLabel(point.month),
  }));
  const totalIncome = data.reduce((sum, point) => sum + point.income, 0);
  const totalExpenses = data.reduce((sum, point) => sum + point.expenses, 0);
  const recentNet = data[data.length - 1]?.net ?? 0;
  const spendingChartConfig = {
    expenses: {
      label: "Expenses",
      color: "var(--color-chart-1)",
    },
  } satisfies ChartConfig;
  const incomeExpenseChartConfig = {
    income: {
      label: "Income",
      color: "var(--color-chart-2)",
    },
    expenses: {
      label: "Expenses",
      color: "var(--color-chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
          <CardDescription>
            Expense totals by month for the most recent period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-muted-foreground text-xs">Total expenses</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totalExpenses, currency)}
              </p>
            </div>
            <p className="text-muted-foreground text-xs">
              {data.length} month{data.length === 1 ? "" : "s"}
            </p>
          </div>
          <ChartContainer config={spendingChartConfig} className="min-h-[220px] w-full">
            <BarChart data={chartData} accessibilityLayer margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={54}
                tickFormatter={(value) => formatCompactCurrency(Number(value), currency)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {formatCurrency(Number(value), currency)}
                      </span>
                    )}
                  />
                }
              />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>
            Month-by-month cashflow comparison.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--color-chart-2)" }}
                />
                Income {formatCurrency(totalIncome, currency)}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--color-chart-1)" }}
                />
                Expenses {formatCurrency(totalExpenses, currency)}
              </div>
            </div>
            <p className={`text-sm font-medium ${recentNet >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              Latest net: {recentNet >= 0 ? "+" : "−"}{formatCurrency(recentNet, currency)}
            </p>
          </div>
          <ChartContainer config={incomeExpenseChartConfig} className="min-h-[220px] w-full">
            <LineChart data={chartData} accessibilityLayer margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={54}
                tickFormatter={(value) => formatCompactCurrency(Number(value), currency)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) => (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {formatCurrency(Number(value), currency)}
                      </span>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="income"
                type="monotone"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="expenses"
                type="monotone"
                stroke="var(--color-expenses)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
