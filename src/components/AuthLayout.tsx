import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, TrendingUp, PieChart, Shield, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: TrendingUp, text: "Smart budget tracking with real-time alerts" },
  { icon: PieChart, text: "Visual spending breakdowns by category" },
  { icon: Landmark, text: "Net worth dashboard across all accounts" },
  { icon: Shield, text: "Bank-grade security with row-level isolation" },
];

export function AuthLayout({
  children,
  backHref = "/",
  backLabel = "Back to home",
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex min-h-svh">
      {/* Left branded panel — hidden on mobile */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-500/10 p-10 lg:flex">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />

        <Link href="/" className="flex items-center gap-2.5 font-semibold">
          <Image src="/logo.svg" alt="Flowdget" width={32} height={32} className="rounded" />
          <span className="text-lg">Flowdget</span>
        </Link>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold leading-tight tracking-tight xl:text-3xl">
            Take control of your<br />personal finances
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Track every pound, set budgets that work, and see your complete financial
            picture — beautifully simple and 100% free.
          </p>
          <div className="space-y-3 pt-2">
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <h.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Flowdget. Free forever.
        </p>
      </div>

      {/* Right form panel */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 md:p-10">
        <Button asChild variant="ghost" size="sm" className="absolute left-6 top-6 md:left-10 md:top-10">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Link>
        </Button>

        {/* Logo on mobile only */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Image src="/logo.svg" alt="Flowdget" width={28} height={28} className="rounded" />
          <span className="text-lg font-semibold">Flowdget</span>
        </div>

        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
