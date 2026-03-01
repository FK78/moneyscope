import { ArrowDownLeft, ArrowUpRight, DollarSign, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}% from last month`;
}

export function getSummaryCards(
  income: number,
  expenses: number,
  lastMonthIncome: number,
  lastMonthExpenses: number,
  savingsBalance: number,
  savingsThisMonth: number,
  currency: string,
) {
  const totalBalance = income - expenses;
  const lastMonthBalance = lastMonthIncome - lastMonthExpenses;

  return [
    {
      title: "Total Balance",
      description: "Income minus expenses this month",
      value: `${totalBalance < 0 ? "−" : ""}${formatCurrency(totalBalance, currency)}`,
      change: pctChange(totalBalance, lastMonthBalance),
      icon: DollarSign,
      color: "text-foreground",
    },
    {
      title: "Income",
      description: "Total income this month",
      value: formatCurrency(income, currency),
      change: pctChange(income, lastMonthIncome),
      icon: ArrowUpRight,
      color: "text-emerald-600",
    },
    {
      title: "Expenses",
      description: "Total spending this month",
      value: formatCurrency(expenses, currency),
      change: pctChange(expenses, lastMonthExpenses),
      icon: ArrowDownLeft,
      color: "text-red-600",
    },
    {
      title: "Savings",
      description: "Total across savings accounts",
      value: formatCurrency(savingsBalance, currency),
      change: `+${formatCurrency(savingsThisMonth, currency)} deposited this month`,
      icon: PiggyBank,
      color: "text-blue-600",
    },
  ];
}
