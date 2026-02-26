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
) {
  const totalBalance = income - expenses;
  const lastMonthBalance = lastMonthIncome - lastMonthExpenses;

  return [
    {
      title: "Total Balance",
      value: formatCurrency(totalBalance),
      change: pctChange(totalBalance, lastMonthBalance),
      icon: DollarSign,
      color: "text-foreground",
    },
    {
      title: "Income",
      value: formatCurrency(income),
      change: pctChange(income, lastMonthIncome),
      icon: ArrowUpRight,
      color: "text-emerald-600",
    },
    {
      title: "Expenses",
      value: formatCurrency(expenses),
      change: pctChange(expenses, lastMonthExpenses),
      icon: ArrowDownLeft,
      color: "text-red-600",
    },
    {
      title: "Savings",
      value: formatCurrency(savingsBalance),
      change: `+${formatCurrency(savingsThisMonth)} this month`,
      icon: PiggyBank,
      color: "text-blue-600",
    },
  ];
}
