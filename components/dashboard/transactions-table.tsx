import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatCurrency, type Transaction } from "@/lib/mock-data"
import TransactionEntity, { TypeTransaction } from "@/modules/transactions/entity/TransactionEntity"

function StatusBadge({ status }: { status: TypeTransaction }) {
  const variant =
    status === "expense" ? "destructive" : "outline"
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

export function TransactionsTable({
  data,
  showAccount = true,
}: {
  data: TransactionEntity[]
  showAccount?: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead className="hidden sm:table-cell">Deskripsi</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">{formatDate(tx.date.toDateString())}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {tx.description}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <StatusBadge status={tx.type} />
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium tabular-nums whitespace-nowrap",
                  tx.type === "income" ? "text-primary" : "text-foreground",
                )}
              >
                {formatCurrency(tx.amount, { signed: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
