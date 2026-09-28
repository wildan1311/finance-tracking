export type TypeTransaction = "INCOME" | "EXPENSE";

/** Shape returned by `GET /api/transactions` (JSON-serialized entity). */
export interface TransactionJson {
  id: string;
  date: string;
  description: string;
  amount: string | number;
  type: TypeTransaction;
  category?: string;
  user?: string;
}

class Transaction {
  constructor(
    public id: string,
    public date: Date,
    public description: string,
    public amount: number,
    public type: TypeTransaction,
    public category: string,
    public user: string,
  ) {}

  /**
   * Rehydrates an entity from an API payload.
   *
   * Lives in the domain (not in a mapper) so presentation code never has to
   * reach into `infrastructure` to build an entity.
   */
  static fromJson(json: TransactionJson): Transaction {
    return new Transaction(
      json.id,
      new Date(json.date),
      json.description,
      parseFloat(json.amount as string),
      json.type,
      json.category || "Uncategorized",
      json.user || "Unknown",
    );
  }
}

export default Transaction;
