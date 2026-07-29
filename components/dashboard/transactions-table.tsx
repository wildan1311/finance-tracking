import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, type Transaction } from "@/lib/mock-data";
import TransactionEntity, {
  TypeTransaction,
} from "@/modules/transactions/entity/TransactionEntity";
import { TRANSACTIONTYPE } from "@/modules/transactions/enums";
import Loading from "../../app/(dashboard)/loading";
import { Loader } from "lucide-react";

function StatusBadge({ status }: { status: TypeTransaction }) {
  const variant =
    status === TRANSACTIONTYPE.EXPENSE ? "destructive" : "outline";
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TransactionsTable({
  loading = false,
  data,
}: {
  loading: boolean;
  data: TransactionEntity[];
}) {
  return (
    <div className="overflow-x-auto relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead align="center" className="text-center w-30">
              Tanggal
            </TableHead>
            <TableHead className="text-center">
              Deskripsi
            </TableHead>
            <TableHead className="text-center w-30">
              Type
            </TableHead>
            <TableHead className="text-center w-30">
              Jumlah
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="text-center">
                {formatDate(tx.date.toDateString())}
              </TableCell>

              <TableCell className=" text-muted-foreground">
                {tx.description}
              </TableCell>

              <TableCell className=" text-center">
                <StatusBadge status={tx.type as TRANSACTIONTYPE} />
              </TableCell>

              <TableCell
                className={cn(
                  "text-right font-medium tabular-nums whitespace-nowrap",
                  tx.type === TRANSACTIONTYPE.INCOME
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {formatCurrency(tx.amount, { signed: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
