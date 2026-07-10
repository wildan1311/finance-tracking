import {defaultFilter, FilterPagination} from "@/modules/shared/FilterType";
import GoogleService from "@/services/GoogleService";
import TransactionRepo from "../TransactionRepo";
import TransactionEntity from "../entity/TransactionEntity";
import TransactionMapper from "../mappers/TransactionMapper";

class GoogleSheetTransactionRepo implements TransactionRepo {
    constructor(private googleService: GoogleService = new GoogleService()) {}
    async getTransactions(filter: FilterPagination = defaultFilter, filterData?: any) : Promise<TransactionEntity[]> {
        const { size, page } = filter;
        const range = `A${page * size - size + 2}:F${page * size + 2}`;
        const data = await this.googleService.getSheetsRange("1yzmd7T9miu7SO9Eba1tfQf6XHWpt6Ct-3xn9BDhvNTE", range);
        return TransactionMapper.fromSheetToDomain(data.data.values);
    }

    async createTransaction(transaction: TransactionEntity): Promise<void> {
        // Implementation for creating transaction in Google Sheets
    }
}

export default GoogleSheetTransactionRepo