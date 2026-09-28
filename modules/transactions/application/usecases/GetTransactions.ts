import { FilterPagination } from "@/modules/shared/domain/Pagination";
import TransactionRepository from "@/modules/transactions/domain/repositories/TransactionRepository";

class GetTransactions{
    constructor(private repo: TransactionRepository){}

    async execute(filter?: FilterPagination){
        const filterPagination : FilterPagination = {
            size: filter?.size || 10,
            page: filter?.page || 1
        }
        const data = await this.repo.getTransactions(filterPagination)
        return data
    }
}

export default GetTransactions