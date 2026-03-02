import { formatCurrency } from "@/lib/formatCurrency";
import { typeIcons } from "@/app/dashboard/accounts/page";
import { Badge } from "./ui/badge";
import { Wallet } from "lucide-react";

export function AccountCard({
  account,
  currency,
}: {
  account: { accountName: string; type: string | null; balance: number };
  currency: string;
}) {
  const Icon = typeIcons[account.type ?? ""] ?? Wallet;
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:shadow-md"
    >
      <div className="bg-primary/8 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{account.accountName}</p>
        <p
          className={`text-lg font-semibold tabular-nums ${
            account.balance >= 0 ? "text-foreground" : "text-red-600"
          }`}
        >
          {account.balance < 0 ? "−" : ""}
          {formatCurrency(account.balance, currency)}
        </p>
        <Badge variant="secondary" className="mt-1 capitalize">
          {account.type?.replace(/([a-z])([A-Z])/g, "$1 $2")}
        </Badge>
      </div>
    </div>
  );
}
