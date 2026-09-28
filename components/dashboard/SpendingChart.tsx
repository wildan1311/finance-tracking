"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCurrency, spendingByCategory } from "@/lib/mock-data"

const chartConfig = {
  amount: { label: "Spent" },
  Housing: { label: "Housing", color: "var(--chart-1)" },
  Food: { label: "Food", color: "var(--chart-2)" },
  Transport: { label: "Transport", color: "var(--chart-3)" },
  Shopping: { label: "Shopping", color: "var(--chart-4)" },
  Other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

export function SpendingChart() {
  const total = React.useMemo(
    () => spendingByCategory.reduce((sum, item) => sum + item.amount, 0),
    [],
  )

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Current month breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={spendingByCategory}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-semibold"
                        >
                          {formatCurrency(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Total spent
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 flex flex-col gap-2">
          {spendingByCategory.map((item) => (
            <div key={item.category} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: item.fill }}
              />
              <span className="flex-1 text-muted-foreground">{item.category}</span>
              <span className="font-medium">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
