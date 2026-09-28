import { FilterPagination } from "@/modules/shared/domain/Pagination";
import { PaginationResult } from "@/modules/shared/domain/PaginationHelper";
import Transaction from "@/modules/transactions/domain/entities/Transaction";

/**
 * Port for transaction persistence. Use cases depend on this interface only;
 * concrete adapters live in `infrastructure/repositories`.
 */
interface TransactionRepository {
  getTransactions(
    filter: FilterPagination,
    filterData?: any,
  ): Promise<PaginationResult<Transaction>>;
  createTransaction(transaction: Transaction): Promise<void>;
}

export default TransactionRepository;