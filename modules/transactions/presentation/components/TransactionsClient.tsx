"use client";

import { RefreshCcw, Search } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { TransactionsTable } from "@/modules/transactions/presentation/components/TransactionsTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Transaction from "@/modules/transactions/domain/entities/Transaction";
import CreateTransactionDialog from "./CreateTransactionDialog";
import PaginationNav from "@/components/shared/PaginationNav";
import useTransactions from "@/modules/transactions/presentation/hooks/useTransactions";
import { PaginationResult } from "@/modules/shared/domain/PaginationHelper";
import { Button } from "@base-ui/react";

interface Props {
  initialData: PaginationResult<Transaction>;
  saveTransaction: (_prevState: unknown, formData: FormData) => Promise<any>;
}

export default function TransactionsClient({
  initialData,
  saveTransaction,
}: Props) {
  const { data, page, query, loading, setPage, refresh } = useTransactions({
    initialData,
  });

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Browse, search, and filter all account activity."
      >
        <CreateTransactionDialog
          handleCreate={saveTransaction}
          refreshTable={refresh}
        />
      </PageHeader>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as Filter)}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
          </Tabs> */}

          <div className="relative flex max-w-xs flex-1 items-center">
            <Search className="absolute left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search merchant or category..."
              className="h-9 pl-8"
              value={query}
              // onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Button className="rounded-xl border cursor-pointer p-2">
            <RefreshCcw className="size-4" onClick={refresh} />
          </Button>
        </CardHeader>

        <CardContent>
          {data.data.length > 0 ? (
            <TransactionsTable data={data.data} loading={loading} />
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No transactions match your filters.
            </p>
          )}
          <PaginationNav
            size={0}
            page={page}
            totalPages={data.totalPage}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </>
  );
}
