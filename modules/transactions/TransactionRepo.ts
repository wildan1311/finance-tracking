import { PaginationResult } from "@/lib/PaginationHelper";
import  {FilterPagination} from "../shared/FilterType";
import TransactionEntity from "./entity/TransactionEntity";

interface TransactionRepo {
    getTransactions(filter: FilterPagination, filterData?: any): Promise<PaginationResult<TransactionEntity>>;
    createTransaction(transaction: TransactionEntity): Promise<void>;
}

export default TransactionRepo;