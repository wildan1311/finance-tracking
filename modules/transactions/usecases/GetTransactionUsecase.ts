import { defaultFilter, FilterPagination } from "@/modules/shared/FilterType";
import TransactionRepo from "../TransactionRepo";
import TransactionEntity from "../entity/TransactionEntity";

class GetTransactionUsecase {
    constructor(private transactionRepo: TransactionRepo) {}

    async execute(filter: FilterPagination = defaultFilter, filterData?: any) : Promise<TransactionEntity[]> {
        return await this.transactionRepo.getTransactions(filter, filterData);
    }
}

export default GetTransactionUsecase;