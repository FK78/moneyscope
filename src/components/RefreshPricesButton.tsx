"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refreshManualHoldingPrices } from "@/db/mutations/investments";

export function RefreshPricesButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => refreshManualHoldingPrices())}
    >
      <RefreshCw className={`mr-1 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Refreshing…" : "Refresh Prices"}
    </Button>
  );
}
