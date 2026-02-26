import { getTransactionsWithDetails } from "@/db/queries/transactions";
import { getAccountsWithDetails } from "@/db/queries/accounts";
import { getCategoriesByUser } from "@/db/queries/categories";
import { TransactionsClient } from "@/components/TransactionsClient";

export default async function Transactions() {
  const [transactions, accounts, categories] = await Promise.all([
    getTransactionsWithDetails(1),
    getAccountsWithDetails(1),
    getCategoriesByUser(1),
  ]);

  return (
    <TransactionsClient
      transactions={transactions}
      accounts={accounts}
      categories={categories}
    />
  );
}
