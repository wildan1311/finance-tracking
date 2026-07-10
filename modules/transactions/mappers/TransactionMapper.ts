import TransactionEntity, { TypeTransaction } from "../entity/TransactionEntity";

class TransactionMapper {
    static toDomain(transactionData: any[]) {
        return transactionData.map(([id, date, description, amount]) => ({
            id,
            date,
            description,
            amount: parseFloat(amount)
        }));
    }

    static fromSheetToDomain(transactionData: any[]) : TransactionEntity[] {
        return transactionData.map(([id, date, description, amount, type, category]) => ({
            id,
            date: new Date(date),
            description,
            amount: parseFloat(amount),
            type: type as TypeTransaction,
            category: category || "Uncategorized" 
        }));
    }
}

export default TransactionMapper;