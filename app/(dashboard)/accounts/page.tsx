import { CreditCard, Landmark, LineChart, Plus, Wallet } from "lucide-react"

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
import { cn } from "@/lib/utils"
import { accounts, formatCurrency } from "@/lib/mock-data"

const iconByType: Record<string, React.ComponentType<{ className?: string }>> = {
  Checking: Wallet,
  Savings: Landmark,
  Credit: CreditCard,
  Investment: LineChart,
}

export default function AccountsPage() {
  const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <>
      <PageHeader
        title="Accounts"
        description="All of your connected accounts in one place."
      >
        <Button>
          <Plus data-icon="inline-start" />
          Link account
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardDescription>Net worth</CardDescription>
          <CardTitle className="text-3xl">{formatCurrency(netWorth)}</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => {
          const Icon = iconByType[account.type] ?? Wallet
          const negative = account.balance < 0
          return (
            <Card key={account.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-base">{account.name}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      •••• {account.last4}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">{account.type}</Badge>
              </CardHeader>
              <CardContent>
                <span
                  className={cn(
                    "text-2xl font-semibold tabular-nums",
                    negative && "text-destructive",
                  )}
                >
                  {formatCurrency(account.balance)}
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
