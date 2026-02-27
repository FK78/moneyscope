import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { AuthButton } from "@/components/AuthButton";
import { getCurrentUserId } from "@/lib/auth";
import { hasCompletedOnboarding } from "@/db/queries/onboarding";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();
  const onboardingComplete = await hasCompletedOnboarding(userId);

  if (!onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen">
      <nav className="border-border sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-lg font-bold tracking-tight"
            >
              MoneyScope
            </Link>
            <DashboardNav />
          </div>
            <Suspense>
              <AuthButton />
            </Suspense>
        </div>
      </nav>
      {children}
    </div>
  );
}
