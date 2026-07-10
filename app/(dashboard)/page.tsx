import Link from "next/link"
import { Plus } from "lucide-react"

import { CashflowChart } from "@/components/dashboard/cashflow-chart"
import { PageHeader } from "@/components/dashboard/page-header"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { StatCards } from "@/components/dashboard/stat-cards"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { transactions } from "@/lib/mock-data"
import path from "path"
import { fileURLToPath } from "url"
import GoogleService from "@/services/GoogleService"

export default async function OverviewPage() {
  // const recent = transactions.slice(0, 6)

  const googleService = new GoogleService();
  const data = await googleService.getSheetsRange("1yzmd7T9miu7SO9Eba1tfQf6XHWpt6Ct-3xn9BDhvNTE", "A2:D");

  console.log(data.data.values);

  return (
    <>
      <PageHeader
        title="Overview"
        description="A snapshot of your finances this month."
      >
        <Button nativeButton={false} render={<Link href="/transactions" />}>
          <Plus data-icon="inline-start" />
          Add transaction
        </Button>
      </PageHeader>

      <StatCards />

      <div className="grid gap-4 xl:grid-cols-3">
        <CashflowChart />
        <SpendingChart />
      </div>

      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </div>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/transactions" />}>
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <TransactionsTable data={recent} />
        </CardContent>
      </Card> */}
    </>
  )
}
