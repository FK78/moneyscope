import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoriesByUser } from "@/db/queries/categories";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { DeleteCategoryButton } from "@/components/DeleteCategoryButton";

export default async function Categories() {
  const categories = await getCategoriesByUser(1);

  const defaultCategories = categories.filter((c) => c.is_default);
  const customCategories = categories.filter((c) => !c.is_default);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your spending categories.
          </p>
        </div>
        <CategoryFormDialog />
      </div>

      {/* Default categories */}
      <Card>
        <CardHeader>
          <CardTitle>Default Categories</CardTitle>
          <CardDescription>
            Built-in categories for common transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {defaultCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-medium">{cat.name}</span>
                <div className="ml-auto flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                  <CategoryFormDialog category={cat} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom categories */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Categories</CardTitle>
          <CardDescription>
            Categories you&apos;ve created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No custom categories yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {customCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <CategoryFormDialog category={cat} />
                    <DeleteCategoryButton category={cat} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
