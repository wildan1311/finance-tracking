import {defaultFilter, FilterPagination} from "@/modules/shared/FilterType";
import GoogleService from "@/services/GoogleService";
import TransactionRepo from "../TransactionRepo";
import TransactionEntity from "../entity/TransactionEntity";
import TransactionMapper from "../mappers/TransactionMapper";
import { config } from "@/config/app";
import PaginationHelper, { PaginationResult } from "@/lib/PaginationHelper";

class GoogleSheetTransactionRepo implements TransactionRepo {
    constructor(private googleService: GoogleService = new GoogleService()) {}
    async getTransactions(filter: FilterPagination = defaultFilter, filterData?: any) : Promise<PaginationResult<TransactionEntity>> {
        const { size, page } = filter;
        const range = `A${page * size - size + 2}:F${page * size + 2}`;
        const [data, countAll] = await Promise.all([
            await this.googleService.getSheetsRange(config.sheet_id || "", range),
            await this.googleService.getSheetsRange(config.sheet_id || "", "A:A")
        ])
        
        if(!data?.data?.values){
            return PaginationHelper.prepareDataForPagination<TransactionEntity>(page, size, 0, []);
        }
        const dataTransaction = data.data.values;
        const countAllTransactions = countAll.data.values.length;
        const transactions = TransactionMapper.fromSheetToDomain(dataTransaction);
        return PaginationHelper.prepareDataForPagination<TransactionEntity>(page, size, countAllTransactions, transactions)
    }

    async createTransaction(transaction: TransactionEntity): Promise<void> {
       const data = await this.googleService.create(config.sheet_id || "", "B:F", TransactionMapper.fromDomainToSheet(transaction));
       return data
    }
}

export default GoogleSheetTransactionRepo