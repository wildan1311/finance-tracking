import Transaction, {
  TypeTransaction,
} from "@/modules/transactions/domain/entities/Transaction";

/**
 * Maps between the Google Sheet row layout and domain entities.
 *
 * Sheet columns are positional:
 *   A=id B=date C=description D=amount E=type F=category G=user
 */
class SheetTransactionMapper {
  /**
   * NOTE: these must stay **plain objects**, not `new Transaction(...)`.
   * The result crosses the server -> client boundary as `initialData` for
   * `<TransactionsClient />`, and React refuses to serialize class instances
   * ("Only plain objects ... can be passed to Client Components").
   */
  static fromSheetToDomain(rows: any[][]): Transaction[] {
    return rows.map(([id, date, description, amount, type, category, user]) => ({
      id,
      date: new Date(date),
      description,
      amount: parseFloat(amount),
      type: type as TypeTransaction,
      category: category || "Uncategorized",
      user: user || "Unknown",
    }));
  }

  /** Append row shape. The id column is left blank so the sheet generates it. */
  static fromDomainToSheet(transaction: Transaction): any[] {
    return [
      null,
      transaction.date.toISOString(),
      transaction.description,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.user,
    ];
  }
}

export default SheetTransactionMapper;
