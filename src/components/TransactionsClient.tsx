"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Receipt, RefreshCw, Trash2, XCircle } from "lucide-react";
import { deleteTransaction } from "@/db/mutations/transactions";
import { formatCurrency } from "@/lib/formatCurrency";

function DeleteTransactionButton({
  transaction,
  onDeleted,
  onDeleteFailed,
}: {
  transaction: Transaction;
  onDeleted: (description: string) => void;
  onDeleteFailed: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const desc = transaction.description;
        await deleteTransaction(transaction.id);
        onDeleted(desc);
      } catch {
        onDeleteFailed();
      } finally {
        setConfirming(false);
      }
    });
  }

  return (
    <AlertDialog open={confirming} onOpenChange={setConfirming}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &ldquo;{transaction.description}&rdquo;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getPageHref(page: number) {
  return page <= 1 ? "/dashboard/transactions" : `/dashboard/transactions?page=${page}`;
}

export function TransactionsClient({
  transactions,
  accounts,
  categories,
  currentPage,
  pageSize,
  totalTransactions,
}: {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  currentPage: number;
  pageSize: number;
  totalTransactions: number;
}) {
  const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set());
  const [deleteResult, setDeleteResult] = useState<{ status: "success" | "error"; description?: string } | null>(null);
  const canCreateTransaction = accounts.length > 0 && categories.length > 0;
  const resolvedCurrentPage = totalTransactions > 0 ? currentPage : 1;
  const totalPages = Math.max(1, Math.ceil(totalTransactions / pageSize));
  const startIndex = totalTransactions > 0 ? (resolvedCurrentPage - 1) * pageSize + 1 : 0;
  const endIndex = totalTransactions > 0
    ? Math.min(resolvedCurrentPage * pageSize, totalTransactions)
    : 0;

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
        {canCreateTransaction ? (
          <TransactionFormDialog
            accounts={accounts}
            categories={categories}
            onSaved={handleTransactionsAdded}
          />
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href={accounts.length === 0 ? "/dashboard/accounts" : "/dashboard/categories"}>
              {accounts.length === 0 ? "Create Account to Start" : "Create Category to Start"}
            </Link>
          </Button>
        )}
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
            <CardTitle className="text-2xl">{totalTransactions}</CardTitle>
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
            A paginated list of your recent transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            totalTransactions === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Receipt className="h-10 w-10 opacity-40" />
                <div>
                  <p className="text-sm font-medium">No transactions yet</p>
                  <p className="text-xs">
                    Add your first transaction to start tracking activity.
                  </p>
                </div>
                {canCreateTransaction ? (
                  <TransactionFormDialog
                    accounts={accounts}
                    categories={categories}
                    onSaved={handleTransactionsAdded}
                  />
                ) : (
                  <Button asChild size="sm" variant="outline">
                    <Link href={accounts.length === 0 ? "/dashboard/accounts" : "/dashboard/categories"}>
                      {accounts.length === 0 ? "Add an account first" : "Add a category first"}
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Receipt className="h-10 w-10 opacity-40" />
                <div>
                  <p className="text-sm font-medium">No transactions on this page</p>
                  <p className="text-xs">
                    Try going back to an earlier page.
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={getPageHref(1)}>Go to first page</Link>
                </Button>
              </div>
            )
          ) : (
            <>
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
                          <DeleteTransactionButton
                            transaction={transaction}
                            onDeleted={(desc) => setDeleteResult({ status: "success", description: desc })}
                            onDeleteFailed={() => setDeleteResult({ status: "error" })}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-xs">
                  Showing {startIndex}–{endIndex} of {totalTransactions} transactions
                </p>
                <div className="flex items-center gap-2">
                  {resolvedCurrentPage > 1 ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={getPageHref(resolvedCurrentPage - 1)}>Previous</Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Previous
                    </Button>
                  )}
                  <p className="text-muted-foreground min-w-28 text-center text-xs">
                    Page {resolvedCurrentPage} of {totalPages}
                  </p>
                  {resolvedCurrentPage < totalPages ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={getPageHref(resolvedCurrentPage + 1)}>Next</Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={deleteResult !== null} onOpenChange={(open) => !open && setDeleteResult(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {deleteResult?.status === "success" ? "Transaction deleted" : "Delete failed"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            {deleteResult?.status === "success" ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Transaction deleted</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    &ldquo;{deleteResult.description}&rdquo; has been removed.
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Delete failed</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Something went wrong. Please try again.
                  </p>
                </div>
              </>
            )}
            <Button onClick={() => setDeleteResult(null)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
