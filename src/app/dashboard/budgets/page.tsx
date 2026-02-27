import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { getBudgets } from "@/db/queries/budgets";
import { getCategoriesByUser } from "@/db/queries/categories";
import { formatCurrency } from "@/lib/formatCurrency";
import { BudgetFormDialog } from "@/components/AddBudgetForm";
import { DeleteBudgetButton } from "@/components/DeleteBudgetButton";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { getCurrentUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getUserBaseCurrency } from "@/db/queries/onboarding";
import { BudgetCharts } from "@/components/BudgetCharts";
import { BudgetAlertSettings } from "@/components/BudgetAlertSettings";
import { getAlertPreferencesByUser } from "@/db/queries/budget-alerts";

export default async function Budgets() {
  const userId = await getCurrentUserId();
  
  const [budgets, categories, baseCurrency, alertPrefs] = await Promise.all([
    getBudgets(userId),
    getCategoriesByUser(userId),
    getUserBaseCurrency(userId),
    getAlertPreferencesByUser(userId),
  ]);

  const alertPrefsMap = new Map(alertPrefs.map(p => [p.budget_id, p]));

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.budgetSpent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCount = budgets.filter((b) => b.budgetSpent > b.budgetAmount).length;
  const spentPercent = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : "0";
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track your spending against monthly budgets.
          </p>
        </div>
        {categories.length === 0 ? (
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/categories">Add Categories First</Link>
          </Button>
        ) : (
          <BudgetFormDialog categories={categories} />
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Budget
            </CardDescription>
            <Target className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">
              {formatCurrency(totalBudget, baseCurrency)}
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Spent
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl text-orange-600">
              {formatCurrency(totalSpent, baseCurrency)}
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-xs">
              {spentPercent}% of total budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Remaining
            </CardDescription>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl text-emerald-600">
              {formatCurrency(totalRemaining, baseCurrency)}
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Over Budget
            </CardDescription>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">
              {overBudgetCount}
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-xs">
              {overBudgetCount === 0
                ? "You're on track!"
                : `${overBudgetCount} categor${overBudgetCount === 1 ? "y" : "ies"} exceeded`}
            </p>
          </CardContent>
        </Card>
      </div>

      {budgets.length > 0 && (
        <BudgetCharts budgets={budgets} currency={baseCurrency} />
      )}

      {/* Budget cards */}
      {budgets.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-center">
            <Target className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-sm font-medium text-foreground">No budgets yet</p>
              <p className="text-xs">Set category limits to monitor spending.</p>
            </div>
            {categories.length === 0 ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/categories">Add a category first</Link>
              </Button>
            ) : (
              <BudgetFormDialog categories={categories} />
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const percent = Math.min(
              (budget.budgetSpent / budget.budgetAmount) * 100,
              100
            );
            const remaining = budget.budgetAmount - budget.budgetSpent;
            const isOver = budget.budgetSpent > budget.budgetAmount;
            const isNear = percent >= 80 && !isOver;
            const Icon = getCategoryIcon(budget.budgetIcon);

            return (
              <Card key={budget.id} className="relative overflow-hidden">
                <div className="p-5 space-y-4">
                  {/* Header: icon + name + actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {Icon ? (
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: budget.budgetColor + "15" }}
                        >
                          <Icon className="h-4 w-4" style={{ color: budget.budgetColor }} />
                        </div>
                      ) : (
                        <div
                          className="h-9 w-9 shrink-0 rounded-lg"
                          style={{ backgroundColor: budget.budgetColor + "15" }}
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate">{budget.budgetCategory}</h3>
                        <p className="text-[11px] text-muted-foreground capitalize">{budget.budgetPeriod} budget</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <BudgetAlertSettings
                        budgetId={budget.id}
                        budgetCategory={budget.budgetCategory}
                        prefs={alertPrefsMap.get(budget.id) ?? null}
                      />
                      <BudgetFormDialog categories={categories} budget={budget} />
                      <DeleteBudgetButton budget={budget} />
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold tabular-nums tracking-tight">
                        {formatCurrency(budget.budgetSpent, baseCurrency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        of {formatCurrency(budget.budgetAmount, baseCurrency)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        isOver
                          ? "destructive"
                          : isNear
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {isOver ? "Over" : isNear ? "Almost" : "On track"}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver
                            ? "bg-red-500"
                            : isNear
                              ? "bg-orange-500"
                              : "bg-emerald-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-xs">
                      <span className="text-muted-foreground tabular-nums">
                        {percent.toFixed(0)}% used
                      </span>
                      <span
                        className={`tabular-nums ${
                          isOver
                            ? "font-medium text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isOver
                          ? `${formatCurrency(Math.abs(remaining), baseCurrency)} over`
                          : `${formatCurrency(remaining, baseCurrency)} left`}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
