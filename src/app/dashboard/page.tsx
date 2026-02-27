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
  getTotalExpensesOfTransactionsThisMonth,
  getLatestFiveTransactionsWithDetails,
  getTotalIncomeOfTransactionsThisMonth,
  getTotalIncomeLastMonth,
  getTotalExpensesLastMonth,
  getSavingsDepositsThisMonth,
  getTotalSpendByCategoryThisMonth,
} from "@/db/queries/transactions";
import { getAccountsWithDetails } from "@/db/queries/accounts";
import { parseTotal } from "@/lib/parseTotal";
import { getSummaryCards } from "@/lib/summaryCards";
import { SummaryCard } from "@/components/SummaryCard";
import { TransactionRow } from "@/components/TransactionRow";
import { AccountCard } from "@/components/AccountCard";
import { SpendCategoryRow } from "@/components/SpendCategoryRow";
import { getCurrentUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const userId = await getCurrentUserId();
  
  const [lastFiveTransactions, accounts, expensesRows, incomeRows, lastMonthIncomeRows, lastMonthExpensesRows, savingsThisMonthRows, spendByCategory] =
    await Promise.all([
      getLatestFiveTransactionsWithDetails(userId),
      getAccountsWithDetails(userId),
      getTotalExpensesOfTransactionsThisMonth(userId),
      getTotalIncomeOfTransactionsThisMonth(userId),
      getTotalIncomeLastMonth(userId),
      getTotalExpensesLastMonth(userId),
      getSavingsDepositsThisMonth(userId),
      getTotalSpendByCategoryThisMonth(userId),
    ]);

  const income = parseTotal(incomeRows);
  const expenses = parseTotal(expensesRows);
  const lastMonthIncome = parseTotal(lastMonthIncomeRows);
  const lastMonthExpenses = parseTotal(lastMonthExpensesRows);
  const savingsBalance = accounts
    .filter((a) => a.type === "savings")
    .reduce((sum, a) => sum + a.balance, 0);

  const summaryCards = getSummaryCards(
    income, expenses,
    lastMonthIncome, lastMonthExpenses,
    savingsBalance, parseTotal(savingsThisMonthRows),
  );
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back, Alice. Here&apos;s your financial overview.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

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
                    <TransactionRow key={t.id} t={t} />
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
                <AccountCard key={account.accountName} account={account} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
