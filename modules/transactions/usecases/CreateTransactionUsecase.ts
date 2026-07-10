import TransactionEntity from "../entity/TransactionEntity";
import TransactionRepo from "../TransactionRepo";

class CreateTransactionUsecase {
    constructor(private transactionRepo: TransactionRepo) {}

    async execute(transaction: TransactionEntity): Promise<void> {
        await this.transactionRepo.createTransaction(transaction);
    }
}

export default CreateTransactionUsecase;