import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function SummaryCard({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <CardTitle className={`text-2xl ${color}`}>
          {value}
        </CardTitle>
        <p className="text-muted-foreground mt-1 text-xs">
          {change}
        </p>
      </CardContent>
    </Card>
  );
}