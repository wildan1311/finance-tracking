import Link from "next/link";
import { InfoIcon, Plus } from "lucide-react";

import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { StatCards } from "@/components/dashboard/stat-cards";
import { Button } from "@/components/ui/button";

export default async function OverviewPage() {
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
  );
}
