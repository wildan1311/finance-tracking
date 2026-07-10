import { Plus } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { budgets, formatCurrency } from "@/lib/mock-data"

export default function BudgetsPage() {
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const overallPct = Math.round((totalSpent / totalLimit) * 100)

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Track spending against your monthly limits."
      >
        <Button>
          <Plus data-icon="inline-start" />
          New budget
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget</CardTitle>
          <CardDescription>
            {formatCurrency(totalSpent)} of {formatCurrency(totalLimit)} spent
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Progress value={overallPct} />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{overallPct}% used</span>
            <span>{formatCurrency(totalLimit - totalSpent)} remaining</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {budgets.map((budget) => {
          const pct = Math.round((budget.spent / budget.limit) * 100)
          const over = budget.spent > budget.limit
          const near = !over && pct >= 85
          return (
            <Card key={budget.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{budget.category}</CardTitle>
                <Badge variant={over ? "destructive" : near ? "outline" : "secondary"}>
                  {over ? "Over" : near ? "Near limit" : "On track"}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-semibold">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {formatCurrency(budget.limit)}
                  </span>
                </div>
                <Progress
                  value={Math.min(pct, 100)}
                  className={cn(over && "[&_[data-slot=progress-indicator]]:bg-destructive")}
                />
                <span className="text-xs text-muted-foreground">
                  {over
                    ? `${formatCurrency(budget.spent - budget.limit)} over budget`
                    : `${formatCurrency(budget.limit - budget.spent)} left`}
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
