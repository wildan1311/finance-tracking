import { env } from "@/config/env";
import { defaultFilter, FilterPagination } from "@/modules/shared/domain/Pagination";
import PaginationHelper, {
  PaginationResult,
} from "@/modules/shared/domain/PaginationHelper";
import Transaction from "@/modules/transactions/domain/entities/Transaction";
import TransactionRepository from "@/modules/transactions/domain/repositories/TransactionRepository";
import SheetTransactionMapper from "@/modules/transactions/infrastructure/mappers/SheetTransactionMapper";
import GoogleSheetsClient from "@/modules/transactions/infrastructure/services/GoogleSheetsClient";

/**
 * Sheet layout contract (do not reorder without migrating the spreadsheet):
 *   data tab       A=id B=date C=description D=amount E=type F=category G=user
 *   pagination tab A2:G is a formula window sliced by I1=page, I2=size
 */
class GoogleSheetTransactionRepository implements TransactionRepository {
  constructor(
    private googleService: GoogleSheetsClient = new GoogleSheetsClient(),
  ) {}

  private get sheetId(): string {
    return env.spreadsheetId || "";
  }

  async getTransactions(
    filter: FilterPagination = defaultFilter,
    filterData?: any,
  ): Promise<PaginationResult<Transaction>> {
    const { size, page } = filter;

    if (page && size) {
      await this.googleService.updateSheetsRange(this.sheetId, "pagination!I1", [[page]]);
      await this.googleService.updateSheetsRange(this.sheetId, "pagination!I2", [[size]]);
    }

    const [data, countAll] = await Promise.all([
      this.googleService.getSheetsRange(this.sheetId, "pagination!A2:G"),
      this.googleService.getSheetsRange(this.sheetId, "A:A"),
    ]);

    if (!data?.data?.values) {
      return PaginationHelper.prepareDataForPagination<Transaction>(page, size, 0, []);
    }

    const transactions = SheetTransactionMapper.fromSheetToDomain(data.data.values);
    const countAllTransactions = countAll.data.values.length;

    return PaginationHelper.prepareDataForPagination<Transaction>(
      page,
      size,
      countAllTransactions,
      transactions,
    );
  }

  async createTransaction(transaction: Transaction): Promise<void> {
    return await this.googleService.create(
      this.sheetId,
      "B:G",
      SheetTransactionMapper.fromDomainToSheet(transaction),
    );
  }
}

export default GoogleSheetTransactionRepository;
