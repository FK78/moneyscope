"use client";

import { useState, useTransition } from "react";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteBudget } from "@/db/mutations/budgets";

export function DeleteBudgetButton({ budget }: { budget: { id: number; budgetCategory: string } }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ status: "success" | "error" } | null>(null);

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteBudget(budget.id);
        setResult({ status: "success" });
      } catch {
        setResult({ status: "error" });
      } finally {
        setConfirming(false);
      }
    });
  }

  return (
    <>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete budget?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the &ldquo;{budget.budgetCategory}&rdquo; budget. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={result !== null} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {result?.status === "success" ? "Budget deleted" : "Delete failed"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            {result?.status === "success" ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Budget deleted</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    The &ldquo;{budget.budgetCategory}&rdquo; budget has been removed.
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Delete failed</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Something went wrong. Please try again.
                  </p>
                </div>
              </>
            )}
            <Button onClick={() => setResult(null)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
