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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function Budgets() {
  const budgets = await getBudgets(1);

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.budgetSpent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCount = budgets.filter((b) => b.budgetSpent > b.budgetAmount).length;
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track your spending against monthly budgets.
        </p>
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
              {formatCurrency(totalBudget)}
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
              {formatCurrency(totalSpent)}
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-xs">
              {((totalSpent / totalBudget) * 100).toFixed(0)}% of total budget
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
              {formatCurrency(totalRemaining)}
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

      {/* Budget cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const percent = Math.min(
            (budget.budgetSpent / budget.budgetAmount) * 100,
            100
          );
          const remaining = budget.budgetAmount - budget.budgetSpent;
          const isOver = budget.budgetSpent > budget.budgetAmount;
          const isNear = percent >= 80 && !isOver;

          return (
            <Card key={budget.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: budget.budgetColor }}
                  />
                  <CardTitle className="text-base">{budget.budgetCategory}</CardTitle>
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
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tabular-nums">
                    {formatCurrency(budget.budgetSpent)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    of {formatCurrency(budget.budgetAmount)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${isOver
                        ? "bg-red-500"
                        : isNear
                          ? "bg-orange-500"
                          : "bg-emerald-500"
                      }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {percent.toFixed(0)}% used
                  </span>
                  <span
                    className={
                      isOver
                        ? "font-medium text-red-600"
                        : "text-muted-foreground"
                    }
                  >
                    {isOver
                      ? `${formatCurrency(Math.abs(remaining))} over`
                      : `${formatCurrency(remaining)} left`}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs capitalize">
                  {budget.budgetPeriod} budget
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
