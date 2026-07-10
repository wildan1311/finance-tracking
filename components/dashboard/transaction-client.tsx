"use client";

import * as React from "react";
import { Download, Search } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionEntity from "@/modules/transactions/entity/TransactionEntity";
import { useTransactionsLocal } from "@/hooks/use-transaction-local";
import { defaultFilter } from "@/modules/shared/FilterType";

type Filter = "all" | "income" | "expense";

interface Props {
  initialData: TransactionEntity[];
}

export default function TransactionsClient({ initialData }: Props) {
  const { transactions, loading, createTransaction } = useTransactionsLocal(defaultFilter);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    return initialData.filter((tx) => {
      // TODO: filter berdasarkan query & filter
      return true;
    });
  }, [initialData, filter, query]);

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Browse, search, and filter all account activity."
      >
        <Button variant="outline">
          <Download data-icon="inline-start" />
          Export
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as Filter)}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative flex max-w-xs flex-1 items-center">
            <Search className="absolute left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search merchant or category..."
              className="h-9 pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {transactions.length > 0 ? (
            <TransactionsTable data={transactions} />
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No transactions match your filters.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}