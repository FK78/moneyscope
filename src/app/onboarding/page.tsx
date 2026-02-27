import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingCategoryForm } from "@/components/OnboardingCategoryForm";
import { getCurrentUserId } from "@/lib/auth";
import { getAccountsWithDetails } from "@/db/queries/accounts";
import { getCategoriesByUser } from "@/db/queries/categories";
import { getBudgets } from "@/db/queries/budgets";
import { getDefaultCategoryTemplates, getOnboardingState } from "@/db/queries/onboarding";
import { addAccount } from "@/db/mutations/accounts";
import { addCategory } from "@/db/mutations/categories";
import { addBudget } from "@/db/mutations/budgets";
import {
  completeOnboarding,
  continueFromCategories,
  skipOnboarding,
} from "@/db/mutations/onboarding";
import { formatCurrency } from "@/lib/formatCurrency";

type Step = "accounts" | "categories" | "budgets" | "review";

function normalizeStep(value?: string): Step {
  if (value === "categories" || value === "budgets" || value === "review") {
    return value;
  }

  return "accounts";
}

async function addOnboardingAccount(formData: FormData) {
  "use server";
  await addAccount(formData);
}

async function addOnboardingCategory(formData: FormData) {
  "use server";
  await addCategory(formData);
}

async function addOnboardingBudget(formData: FormData) {
  "use server";
  await addBudget(formData);
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ step?: string }>;
}) {
  const userId = await getCurrentUserId();
  const resolvedSearchParams = await searchParams;
  const step = normalizeStep(resolvedSearchParams?.step);

  const [onboardingState, accounts, categories, budgets, defaultTemplates] =
    await Promise.all([
      getOnboardingState(userId),
      getAccountsWithDetails(userId),
      getCategoriesByUser(userId),
      getBudgets(userId),
      getDefaultCategoryTemplates(),
    ]);

  if (onboardingState?.completed) {
    redirect("/dashboard");
  }

  const defaultCategoryPreference = onboardingState?.use_default_categories ?? false;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Set up your workspace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add accounts, categories, and budgets. Every step is optional.
          </p>
        </div>
        <form action={skipOnboarding}>
          <Button type="submit" variant="outline">Skip onboarding</Button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {(["accounts", "categories", "budgets", "review"] as Step[]).map((item) => (
          <Link key={item} href={`/onboarding?step=${item}`}>
            <div
              className={`rounded-md border px-3 py-2 text-center text-sm font-medium capitalize ${
                step === item ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}
            >
              {item}
            </div>
          </Link>
        ))}
      </div>

      {step === "accounts" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Accounts</CardTitle>
            <CardDescription>
              Create one or more accounts, or skip this step.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={addOnboardingAccount} className="grid gap-4 rounded-md border p-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" name="name" placeholder="Main Checking" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                  defaultValue="checking"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="investment">Investment</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="balance">Starting Balance</Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  defaultValue="0"
                  className="input-no-spinner"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  name="currency"
                  className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                  defaultValue="USD"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
              <Button type="submit" className="w-fit">Add account</Button>
            </form>

            <div className="space-y-2">
              <p className="text-sm font-medium">Your accounts</p>
              {accounts.length === 0 ? (
                <p className="text-muted-foreground text-sm">No accounts yet.</p>
              ) : (
                <div className="space-y-2">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                      <span>{account.accountName}</span>
                      <span className="text-muted-foreground">{formatCurrency(account.balance)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button asChild>
                <Link href="/onboarding?step=categories">Continue to categories</Link>
              </Button>
              {accounts.length === 0 && (
                <Button asChild variant="outline">
                  <Link href="/onboarding?step=categories">Skip this step</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === "categories" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Categories</CardTitle>
              <CardDescription>
                Choose whether to add default categories, then optionally create your own.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={continueFromCategories} className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    name="use_default_categories"
                    type="checkbox"
                    defaultChecked={defaultCategoryPreference}
                    className="h-4 w-4"
                  />
                  Add default categories from templates
                </label>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {defaultTemplates.map((template) => (
                    <div key={template.id} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: template.color }}
                      />
                      <span>{template.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" name="intent" value="apply">
                    Add selected defaults
                  </Button>
                  <Button type="submit" name="intent" value="continue" variant="outline">
                    Continue to budgets
                  </Button>
                </div>
              </form>
              {categories.length === 0 && (
                <form action={continueFromCategories}>
                  <input type="hidden" name="use_default_categories" value="" />
                  <input type="hidden" name="intent" value="continue" />
                  <Button type="submit" variant="outline">Skip this step</Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add custom category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OnboardingCategoryForm action={addOnboardingCategory} />

              <div className="space-y-2">
                <p className="text-sm font-medium">Your categories</p>
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No categories yet.</p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "budgets" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Budgets</CardTitle>
            <CardDescription>
              Add budgets now, or skip and do this later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Add at least one category before creating budgets.
              </p>
            ) : (
              <form action={addOnboardingBudget} className="grid gap-4 rounded-md border p-4">
                <div className="grid gap-2">
                  <Label htmlFor="category_id">Category</Label>
                  <select
                    id="category_id"
                    name="category_id"
                    className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="input-no-spinner"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="period">Period</Label>
                  <select
                    id="period"
                    name="period"
                    className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                    defaultValue="monthly"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" name="start_date" type="date" defaultValue={today} required />
                </div>
                <Button type="submit" className="w-fit">Add budget</Button>
              </form>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Your budgets</p>
              {budgets.length === 0 ? (
                <p className="text-muted-foreground text-sm">No budgets yet.</p>
              ) : (
                <div className="space-y-2">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                      <span>{budget.budgetCategory}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(budget.budgetAmount)} / {budget.budgetPeriod}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button asChild>
                <Link href="/onboarding?step=review">Continue to review</Link>
              </Button>
              {budgets.length === 0 && (
                <Button asChild variant="outline">
                  <Link href="/onboarding?step=review">Skip this step</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === "review" && (
        <Card>
          <CardHeader>
            <CardTitle>Review and finish</CardTitle>
            <CardDescription>
              You can finish now or go back and adjust anything.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md border p-3 text-center">
                <p className="text-2xl font-semibold">{accounts.length}</p>
                <p className="text-muted-foreground text-xs">Accounts</p>
              </div>
              <div className="rounded-md border p-3 text-center">
                <p className="text-2xl font-semibold">{categories.length}</p>
                <p className="text-muted-foreground text-xs">Categories</p>
              </div>
              <div className="rounded-md border p-3 text-center">
                <p className="text-2xl font-semibold">{budgets.length}</p>
                <p className="text-muted-foreground text-xs">Budgets</p>
              </div>
            </div>

            <div className="flex gap-2">
              <form action={completeOnboarding}>
                <Button type="submit">Finish onboarding</Button>
              </form>
              <Button asChild variant="outline">
                <Link href="/onboarding?step=accounts">Back to start</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
