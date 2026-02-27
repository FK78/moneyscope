import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoriesByUser } from "@/db/queries/categories";
import {
  getMonthlyCategorySpendTrend,
  getTotalSpendByCategoryThisMonth,
} from "@/db/queries/transactions";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { DeleteCategoryButton } from "@/components/DeleteCategoryButton";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { getCurrentUserId } from "@/lib/auth";
import { getUserBaseCurrency } from "@/db/queries/onboarding";
import { Tags } from "lucide-react";
import { CategoryCharts } from "@/components/CategoryCharts";

export default async function Categories() {
  const userId = await getCurrentUserId();

  const [categories, topSpendRows, monthlySpendRows, baseCurrency] = await Promise.all([
    getCategoriesByUser(userId),
    getTotalSpendByCategoryThisMonth(userId),
    getMonthlyCategorySpendTrend(userId, 6),
    getUserBaseCurrency(userId),
  ]);

  const topSpendByCategory = topSpendRows
    .map((row) => ({
      category: row.category,
      color: row.color,
      total: Number(row.total) || 0,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your spending categories.
          </p>
        </div>
        <CategoryFormDialog />
      </div>

      {(topSpendByCategory.length > 0 || monthlySpendRows.length > 0) && (
        <CategoryCharts
          topThisMonth={topSpendByCategory}
          monthlyRows={monthlySpendRows}
          currency={baseCurrency}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Manage all your categories in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-center">
              <Tags className="h-10 w-10 opacity-40" />
              <div>
                <p className="text-sm font-medium text-foreground">No categories yet</p>
                <p className="text-xs">Create categories to organize your transactions.</p>
              </div>
              <CategoryFormDialog />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {Icon ? (
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: cat.color + "20" }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                    </div>
                  ) : (
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  )}
                  <span className="text-sm font-medium">{cat.name}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <CategoryFormDialog category={cat} />
                    <DeleteCategoryButton category={cat} />
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
