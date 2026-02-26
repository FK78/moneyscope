"use client";

import { useState, useEffect, useCallback } from "react";
import { TransactionFormDialog } from "@/components/AddTransactionForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, Receipt, RefreshCw } from "lucide-react";

type Transaction = {
  id: number;
  accountName: string;
  account_id: number | null;
  type: "income" | "expense" | null;
  amount: number;
  category: string;
  category_id: number | null;
  description: string;
  date: string | null;
  is_recurring: boolean;
};

type Account = { id: number; accountName: string };
type Category = { id: number; name: string };

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function TransactionsClient({
  transactions,
  accounts,
  categories,
}: {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}) {
  const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (highlightedIds.size === 0) return;
    const timer = setTimeout(() => {
      setHighlightedIds(new Set());
    }, 3000);
    return () => clearTimeout(timer);
  }, [highlightedIds]);

  const handleTransactionsAdded = useCallback((ids: number[]) => {
    setHighlightedIds(new Set(ids));
  }, []);

  const handleTransactionEdited = useCallback((id: number) => {
    setHighlightedIds(new Set([id]));
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review and manage your recent financial activity.
          </p>
        </div>
        <TransactionFormDialog
          accounts={accounts}
          categories={categories}
          onSaved={handleTransactionsAdded}
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Transactions
            </CardDescription>
            <Receipt className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{transactions.length}</CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Income
            </CardDescription>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl text-emerald-600">
              {formatCurrency(totalIncome)}
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Expenses
            </CardDescription>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl text-red-600">
              {formatCurrency(totalExpenses)}
            </CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of your recent transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm font-medium">No transactions yet</p>
              <p className="text-xs">
                Your transactions will appear here once added.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className={
                      highlightedIds.has(transaction.id)
                        ? "animate-highlight-row"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {transaction.accountName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.category ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold tabular-nums ${transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                        }`}
                    >
                      {transaction.type === "income" ? "+" : "−"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.is_recurring && (
                          <Badge variant="secondary" className="gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Recurring
                          </Badge>
                        )}
                        <TransactionFormDialog
                          transaction={transaction}
                          accounts={accounts}
                          categories={categories}
                          onSaved={(ids) => handleTransactionEdited(ids[0])}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
