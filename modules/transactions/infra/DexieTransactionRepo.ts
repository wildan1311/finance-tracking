import { FilterPagination } from '@/modules/shared/FilterType';
import TransactionEntity from '../entity/TransactionEntity';
import TransactionRepo from '../TransactionRepo';
import DexieService from '@/services/DexieService';

export class DexieTransactionRepo implements TransactionRepo {
    constructor(private db: DexieService = DexieService.getInstance()) {}

    async getTransactions(filter: FilterPagination, filterData?: any): Promise<TransactionEntity[]> {
        const transactions = await this.db.transactions.toArray();
        return transactions;
    }

    async createTransaction(transaction: TransactionEntity): Promise<void> {
        await this.db.transactions.add(transaction);
    }
}
