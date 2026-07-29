"use client";

import { Search } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TransactionEntity from "@/modules/transactions/entity/TransactionEntity";
import CreateTransactionDialog from "./create-transaction-dialog";
import PaginationApp from "../shared/pagination";
import useTransactions from "@/modules/transactions/presentations/hooks/useTransaction";
import { PaginationResult } from "@/lib/PaginationHelper";

type Filter = "all" | "income" | "expense";

interface Props {
  initialData: PaginationResult<TransactionEntity>;
  saveTransaction: (_prevState: any, formData: FormData) => Promise<any>;
}

export default function TransactionsClient({
  initialData,
  saveTransaction,
}: Props) {
  const {
    data,
    page,
    query,
    loading,
    setPage,
    refresh,
  } = useTransactions({ initialData });

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Browse, search, and filter all account activity."
      >
        <CreateTransactionDialog handleCreate={saveTransaction} refreshTable={refresh} />
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
        </CardHeader>

        <CardContent>
          {data.data.length > 0 ? (
            <TransactionsTable data={data.data} loading={loading} />
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No transactions match your filters.
            </p>
          )}
          <PaginationApp
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
