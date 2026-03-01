"use client";

import { useState, useTransition, type ReactNode } from "react";
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

type DeleteConfirmButtonProps = {
  onDelete: () => Promise<void>;
  triggerClassName?: string;
  triggerIconClassName?: string;
  dialogTitle: string;
  dialogDescription: ReactNode;
  successTitle: string;
  successDescription: ReactNode;
};

export function DeleteConfirmButton({
  onDelete,
  triggerClassName = "h-8 w-8 text-muted-foreground hover:text-destructive",
  triggerIconClassName = "h-4 w-4",
  dialogTitle,
  dialogDescription,
  successTitle,
  successDescription,
}: DeleteConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ status: "success" | "error" } | null>(null);

  function handleDelete() {
    startTransition(async () => {
      try {
        await onDelete();
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
          <Button variant="ghost" size="icon" className={triggerClassName}>
            <Trash2 className={triggerIconClassName} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
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
              {result?.status === "success" ? successTitle : "Delete failed"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            {result?.status === "success" ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{successTitle}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{successDescription}</p>
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
