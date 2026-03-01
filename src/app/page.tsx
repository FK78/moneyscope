import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CreditCard,
  Filter,
  Landmark,
  PieChart,
  Receipt,
  Shield,
  Tag,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "Smart Budget Tracking",
    description:
      "Set monthly budgets per category and get real-time progress bars that turn amber at 80% and red when you go over. Never overspend without knowing.",
  },
  {
    icon: PieChart,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "Spending Breakdown",
    description:
      "See exactly where your money goes with colour-coded category breakdowns. Understand your spending patterns at a glance.",
  },
  {
    icon: CreditCard,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    title: "Multi-Account Management",
    description:
      "Track current accounts, savings, credit cards, and investments in one place. See your net worth with a clear assets-vs-liabilities view.",
  },
  {
    icon: BarChart3,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    title: "Cashflow Charts",
    description:
      "Visualise income vs expenses over time with rolling averages, monthly spending trends, and savings rate charts — spot problems before they happen.",
  },
  {
    icon: Bell,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    title: "Budget Alerts",
    description:
      "Get notified when you're approaching your budget limit. Choose between browser notifications and email alerts with custom thresholds per budget.",
  },
  {
    icon: Tag,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    title: "Custom Categories",
    description:
      "Create your own spending categories with custom colours and icons, or start with sensible defaults during onboarding. Your money, your rules.",
  },
  {
    icon: Filter,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Auto-Categorisation Rules",
    description:
      "Set pattern-matching rules so transactions from Tesco always go to Groceries, Netflix always goes to Subscriptions — saves hours of manual tagging.",
  },
  {
    icon: Receipt,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    title: "Transaction Management",
    description:
      "Add, edit, and delete transactions with full pagination, search, sorting, and date-range filtering. Export to CSV any time.",
  },
  {
    icon: Landmark,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    title: "Net Worth Dashboard",
    description:
      "A single view showing your total net worth, month progress, budget health, recent activity, and account balances. Everything you need in one screen.",
  },
];

const steps = [
  {
    step: "1",
    title: "Create your account",
    description: "Sign up in seconds with email. No credit card, no trial — just free.",
  },
  {
    step: "2",
    title: "Add your accounts",
    description: "Set up your bank accounts, savings, credit cards, and investments with starting balances.",
  },
  {
    step: "3",
    title: "Track everything",
    description: "Log transactions, set budgets, and watch your financial picture come to life with charts and insights.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.svg" alt="Flowdget logo" width={28} height={28} className="rounded" />
            Flowdget
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden px-6 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
            100% free &mdash; no ads, no premium tier
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your money, finally{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              under control
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Flowdget is the personal finance app that helps you track every pound,
            set budgets that actually work, and see your full financial picture
            in one beautifully simple dashboard.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Start tracking for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/auth/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Social proof stats */}
      <section className="border-y bg-muted/30 px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          <div>
            <p className="text-3xl font-bold">9+</p>
            <p className="mt-1 text-sm text-muted-foreground">Feature areas</p>
          </div>
          <div>
            <p className="text-3xl font-bold">4</p>
            <p className="mt-1 text-sm text-muted-foreground">Account types</p>
          </div>
          <div>
            <p className="text-3xl font-bold">6</p>
            <p className="mt-1 text-sm text-muted-foreground">Chart views</p>
          </div>
          <div>
            <p className="text-3xl font-bold">&pound;0</p>
            <p className="mt-1 text-sm text-muted-foreground">Forever</p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your money
            </h2>
            <p className="mt-4 text-muted-foreground">
              No bloat, no upsells. Every feature below is included from day one.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-muted-foreground">
              No complicated setup. No bank linking. Just start adding your data.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {s.step}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security callout */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-gradient-to-r from-primary/5 to-emerald-500/5 p-8 sm:p-12">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your data stays yours</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Flowdget uses Supabase with row-level security — your financial data is
                isolated and encrypted. We don&apos;t sell data, serve ads, or share anything
                with third parties. Ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to take control?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join Flowdget today — it takes less than a minute to sign up and
            it&apos;s completely free. No catches.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Create your free account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Image src="/logo.svg" alt="Flowdget" width={20} height={20} className="rounded" />
            Flowdget
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Supabase &amp; Drizzle ORM
          </p>
        </div>
      </footer>
    </div>
  );
}
