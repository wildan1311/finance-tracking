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

    static jsonToDomain(json: any): TransactionEntity {
        return new TransactionEntity(
            json.id,
            new Date(json.date),
            json.description,
            parseFloat(json.amount),
            json.type as TypeTransaction,
            json.category || "Uncategorized"
        );
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

    static fromDomainToSheet(transaction: TransactionEntity): any[] {
        return [
            null,
            transaction.date.toISOString().replace('T', ' '),
            transaction.description,
            transaction.amount,
            transaction.type,
            transaction.category
        ];
    }
}

export default TransactionMapper;