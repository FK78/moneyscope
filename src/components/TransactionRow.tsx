import { formatCurrency } from "@/lib/formatCurrency";
import { TableCell, TableRow } from "./ui/table";

export function TransactionRow({ t }: { t: { id: number; description: string | null; category: string; date: string | null; amount: number; type: "income" | "expense" } }) {
    return (
        <TableRow>
            <TableCell className="font-medium">
                {t.description}
            </TableCell>
            <TableCell className="text-muted-foreground">
                {t.category}
            </TableCell>
            <TableCell className="text-muted-foreground">
                {t.date}
            </TableCell>
            <TableCell
                className={`text-right font-semibold tabular-nums ${t.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}
            >
                {t.type === "income" ? "+" : "−"}
                {formatCurrency(t.amount)}
            </TableCell>
        </TableRow>
    );
}