"use client";

import { useState, useTransition } from "react";
import { Plus, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addAccount } from "@/db/mutations/accounts";

export function AddAccountForm() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"form" | "success">("form");
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setView("form");
    }
    setOpen(nextOpen);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addAccount(formData);
      setView("success");
    });
  }

  function handleAddAnother() {
    setFormKey((k) => k + 1);
    setView("form");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {view === "success" ? (
          <>
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Account added!</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Your new account has been created.
                </p>
              </div>
            </div>
            <DialogFooter className="flex gap-2 sm:justify-center">
              <Button variant="outline" onClick={handleAddAnother}>
                <Plus className="mr-1 h-4 w-4" />
                Add Another
              </Button>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add Account</DialogTitle>
              <DialogDescription>
                Enter the details for a new account.
              </DialogDescription>
            </DialogHeader>
            <form
              key={formKey}
              onSubmit={handleSubmit}
              className="grid gap-4"
            >
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Main Checking"
                  required
                />
              </div>

              {/* Type */}
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue="checking">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Balance */}
              <div className="grid gap-2">
                <Label htmlFor="balance">Starting Balance</Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  defaultValue="0.00"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Currency */}
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select name="currency" defaultValue="USD">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Account
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
