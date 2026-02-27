import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getAccountsWithDetails } from "@/db/queries/accounts";
import { AccountFormDialog } from "@/components/AddAccountForm";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { formatCurrency } from "@/lib/formatCurrency";
import { getCurrentUserId } from "@/lib/auth";
import { getUserBaseCurrency } from "@/db/queries/onboarding";
import { AccountCharts } from "@/components/AccountCharts";

const typeConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  checking: { label: "Checking", variant: "secondary" },
  savings: { label: "Savings", variant: "default" },
  credit_card: { label: "Credit Card", variant: "destructive" },
  investment: { label: "Investment", variant: "outline" },
};

export const typeIcons: Record<string, typeof Wallet> = {
  checking: Wallet,
  savings: PiggyBank,
  credit_card: CreditCard,
  investment: TrendingUp,
};

export default async function Accounts() {
  const userId = await getCurrentUserId();

  const [accounts, baseCurrency] = await Promise.all([
    getAccountsWithDetails(userId),
    getUserBaseCurrency(userId),
  ]);

  const liabilityTypes = new Set(["credit_card"]);
  const totalAssets = accounts
    .filter((a) => !liabilityTypes.has(a.type ?? ""))
    .reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts
    .filter((a) => liabilityTypes.has(a.type ?? ""))
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const totalBalance = totalAssets - totalLiabilities;
  const totalAbsolute = accounts.reduce((sum, a) => sum + Math.abs(a.balance), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage and monitor all your linked accounts.
          </p>
        </div>
        <AccountFormDialog />
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Net Worth
            </CardDescription>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CardTitle className={`text-2xl ${totalBalance < 0 ? "text-red-600" : ""}`}>
              {totalBalance < 0 ? "−" : ""}{formatCurrency(totalBalance, baseCurrency)}
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-xs">
              Across {accounts.length} accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Assets
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className={`text-2xl ${totalAssets < 0 ? "text-red-600" : "text-emerald-600"}`}>
              {totalAssets < 0 ? "−" : ""}{formatCurrency(totalAssets, baseCurrency)}
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Liabilities
            </CardDescription>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl text-red-600">
              {formatCurrency(totalLiabilities, baseCurrency)}
            </CardTitle>
          </CardContent>
        </Card>
      </div>

      {accounts.length > 0 && (
        <AccountCharts accounts={accounts} currency={baseCurrency} />
      )}

      {/* Account cards */}
      {accounts.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-center">
            <Wallet className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-sm font-medium text-foreground">No accounts yet</p>
              <p className="text-xs">Create your first account to start tracking balances.</p>
            </div>
            <AccountFormDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {accounts.map((account) => {
            const config = typeConfig[account.type ?? ""] ?? {
              label: account.type,
              variant: "secondary" as const,
            };
            return (
              <Card key={account.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      {(() => { const Icon = typeIcons[account.type ?? ""] ?? Wallet; return <Icon className="text-muted-foreground h-5 w-5" />; })()}
                    </div>
                    <div>
                      <CardTitle className="text-base">{account.accountName}</CardTitle>
                      <CardDescription className="text-xs">
                        {account.transactions} transactions
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    <AccountFormDialog account={account} />
                    <DeleteAccountButton account={account} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-2xl font-bold tabular-nums ${account.balance >= 0 ? "text-foreground" : "text-red-600"
                      }`}
                  >
                    {account.balance < 0 ? "−" : ""}
                    {formatCurrency(account.balance, baseCurrency)}
                  </p>
                  {/* Balance bar relative to total assets */}
                  <div className="mt-3">
                    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${account.balance >= 0 ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        style={{
                          width: `${totalAbsolute > 0 ? Math.min(
                            (Math.abs(account.balance) / totalAbsolute) * 100,
                            100
                          ) : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {totalAbsolute > 0 ? ((Math.abs(account.balance) / totalAbsolute) * 100).toFixed(
                        1
                      ) : "0.0"}
                      % of total
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
