"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-10">
      <Card className="mx-auto max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle>Couldn&apos;t load onboarding</CardTitle>
          <CardDescription>
            We hit an error while loading your setup progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/onboarding">Reload onboarding</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
