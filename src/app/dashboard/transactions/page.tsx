import { redirect } from "next/navigation";
import {
  getTransactionsCount,
  getTransactionsWithDetailsPaginated,
} from "@/db/queries/transactions";
import { getAccountsWithDetails } from "@/db/queries/accounts";
import { getCategoriesByUser } from "@/db/queries/categories";
import { TransactionsClient } from "@/components/TransactionsClient";
import { getCurrentUserId } from "@/lib/auth";

const PAGE_SIZE = 10;

function normalizePage(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export default async function Transactions({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const requestedPage = normalizePage(resolvedSearchParams?.page);
  const userId = await getCurrentUserId();

  const [transactions, accounts, categories, totalTransactions] = await Promise.all([
    getTransactionsWithDetailsPaginated(userId, requestedPage, PAGE_SIZE),
    getAccountsWithDetails(userId),
    getCategoriesByUser(userId),
    getTransactionsCount(userId),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalTransactions / PAGE_SIZE));

  if (totalTransactions > 0 && requestedPage > totalPages) {
    redirect(totalPages === 1 ? "/dashboard/transactions" : `/dashboard/transactions?page=${totalPages}`);
  }

  return (
    <TransactionsClient
      transactions={transactions}
      accounts={accounts}
      categories={categories}
      currentPage={requestedPage}
      pageSize={PAGE_SIZE}
      totalTransactions={totalTransactions}
    />
  );
}
