import TransactionEntity from '@/modules/transactions/entity/TransactionEntity';
import Dexie, { Table } from 'dexie';

// Pastikan kode hanya berjalan di browser (Client-Side)
const isClient = typeof window !== 'undefined';

// 1. Buat Class yang mewarisi (extends) dari Dexie
export default class DexieService extends Dexie {
  private static instance: DexieService;

  public transactions!: Table<TransactionEntity, number>;

  private constructor() {
    super("SpreadsheetLokalDB");

    this.version(1).stores({
      transactions: "++id, date, description, amount, category, type",
    });
  }

  public static getInstance(): DexieService {
    if (!DexieService.instance) {
      DexieService.instance = new DexieService();
    }

    return DexieService.instance;
  }
}
