import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getLatestFiveTransactionsWithDetails,
  getTotalsByType,
  getSavingsDepositTotal,
  getTotalSpendByCategoryThisMonth,
  getMonthlyIncomeExpenseTrend,
} from "@/db/queries/transactions";
import { getAccountsWithDetails } from "@/db/queries/accounts";
import { getMonthRange } from "@/lib/date";
import { getSummaryCards } from "@/lib/summaryCards";
import { SummaryCard } from "@/components/SummaryCard";
import { TransactionRow } from "@/components/TransactionRow";
import { AccountCard } from "@/components/AccountCard";
import { SpendCategoryRow } from "@/components/SpendCategoryRow";
import { getCurrentUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getUserBaseCurrency } from "@/db/queries/onboarding";
import { CashflowCharts } from "@/components/CashflowCharts";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const userId = await getCurrentUserId();
  const thisMonth = getMonthRange(0);
  const lastMonth = getMonthRange(1);

  const [lastFiveTransactions, accounts, income, expenses, lastMonthIncome, lastMonthExpenses, savingsThisMonth, spendByCategory, monthlyTrend, baseCurrency] =
    await Promise.all([
      getLatestFiveTransactionsWithDetails(userId),
      getAccountsWithDetails(userId),
      getTotalsByType(userId, 'income', thisMonth.start, thisMonth.end),
      getTotalsByType(userId, 'expense', thisMonth.start, thisMonth.end),
      getTotalsByType(userId, 'income', lastMonth.start, lastMonth.end),
      getTotalsByType(userId, 'expense', lastMonth.start, lastMonth.end),
      getSavingsDepositTotal(userId, thisMonth.start, thisMonth.end),
      getTotalSpendByCategoryThisMonth(userId),
      getMonthlyIncomeExpenseTrend(userId, 6),
      getUserBaseCurrency(userId),
    ]);

  const savingsBalance = accounts
    .filter((a: { type: string | null }) => a.type === "savings")
    .reduce((sum: number, a: { balance: number }) => sum + a.balance, 0);

  const summaryCards = getSummaryCards(
    income, expenses,
    lastMonthIncome, lastMonthExpenses,
    savingsBalance, savingsThisMonth,
    baseCurrency,
  );

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back, {user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email}. Here&apos;s your financial overview.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <CashflowCharts data={monthlyTrend} currency={baseCurrency} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your last 5 transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {lastFiveTransactions.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-10 text-center">
                <p className="text-sm font-medium text-foreground">No transactions yet</p>
                <p className="text-xs">Add a transaction to populate your dashboard.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/transactions">Go to transactions</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lastFiveTransactions.map((t) => (
                    <TransactionRow key={t.id} t={t} currency={baseCurrency} />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Spending by category */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>This month&apos;s breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {spendByCategory.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-6 text-center">
                <p className="text-sm font-medium text-foreground">No category spend yet</p>
                <p className="text-xs">Your expense breakdown appears once transactions are added.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/transactions">Add transaction</Link>
                </Button>
              </div>
            ) : (
              spendByCategory.map((cat) => (
                <SpendCategoryRow
                  key={cat.category}
                  category={cat.category}
                  total={cat.total}
                  color={cat.color}
                  income={income}
                  currency={baseCurrency}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accounts overview */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Overview of your linked accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="text-sm font-medium text-foreground">No accounts linked</p>
              <p className="text-xs">Create an account to start tracking balances and transactions.</p>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/accounts">Go to accounts</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {accounts.map((account) => (
                <AccountCard key={account.accountName} account={account} currency={baseCurrency} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
