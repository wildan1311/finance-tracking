import { FilterPagination } from '@/modules/shared/FilterType';
import TransactionRepo from '../TransactionRepo';

class GetTransactionUsecase{
    constructor(private repo: TransactionRepo){}

    async execute(filter?: FilterPagination){
        const filterPagination : FilterPagination = {
            size: filter?.size || 10,
            page: filter?.page || 1
        }
        const data = await this.repo.getTransactions(filterPagination)
        return data
    }
}

export default GetTransactionUsecase