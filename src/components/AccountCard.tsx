import { formatCurrency } from "@/lib/formatCurrency";
import { typeIcons } from "@/app/dashboard/accounts/page";
import { Badge } from "./ui/badge";
import { Wallet } from "lucide-react";

export function AccountCard({ account }: { account: { accountName: string; type: string | null; balance: number } }) {
  const Icon = typeIcons[account.type ?? ""] ?? Wallet;
  return (
    <div
      className="border-border flex items-center gap-3 rounded-lg border p-4"
    >
      <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{account.accountName}</p>
        <p
          className={`text-lg font-semibold tabular-nums ${
            account.balance >= 0 ? "text-foreground" : "text-red-600"
          }`}
        >
          {account.balance < 0 ? "−" : ""}
          {formatCurrency(account.balance)}
        </p>
        <Badge variant="secondary" className="mt-1 capitalize">
          {account.type?.replace("_", " ")}
        </Badge>
      </div>
    </div>
  );
}