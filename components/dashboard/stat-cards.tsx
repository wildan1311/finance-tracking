import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatCurrency, stats } from "@/lib/mock-data"

type Stat = {
  label: string
  value: string
  change: number
  icon: React.ComponentType<{ className?: string }>
  positiveIsGood?: boolean
}

const items: Stat[] = [
  {
    label: "Total Balance",
    value: formatCurrency(stats.totalBalance),
    change: stats.totalBalanceChange,
    icon: Wallet,
  },
  {
    label: "Income (30d)",
    value: formatCurrency(stats.income),
    change: stats.incomeChange,
    icon: TrendingUp,
  },
  {
    label: "Expenses (30d)",
    value: formatCurrency(stats.expenses),
    change: stats.expensesChange,
    icon: TrendingDown,
    positiveIsGood: false,
  },
  {
    label: "Savings Rate",
    value: `${stats.savingsRate}%`,
    change: stats.savingsRateChange,
    icon: PiggyBank,
  },
]

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const isUp = item.change >= 0
        const good = item.positiveIsGood === false ? !isUp : isUp
        return (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <item.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tracking-tight">{item.value}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  good ? "text-primary" : "text-destructive",
                )}
              >
                {isUp ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {Math.abs(item.change)}%
                <span className="text-muted-foreground font-normal">vs last month</span>
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
