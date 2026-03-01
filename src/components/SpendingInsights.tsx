import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Repeat } from "lucide-react";
import type { Insight } from "@/lib/insights";

const iconMap: Record<Insight["type"], { icon: typeof TrendingUp; color: string; bg: string }> = {
  spike: { icon: TrendingUp, color: "text-red-500", bg: "bg-red-500/10" },
  drop: { icon: TrendingDown, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  streak: { icon: Repeat, color: "text-amber-500", bg: "bg-amber-500/10" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  info: { icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-500/10" },
};

export function SpendingInsights({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const { icon: Icon, color, bg } = iconMap[insight.type];
        return (
          <div key={i} className="flex items-start gap-3">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pt-0.5">
              {insight.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
