import { CreateTransactionDto } from "../dto/create.dto";
import TransactionEntity from "../entity/TransactionEntity";
import TransactionRepo from "../TransactionRepo";

class CreateTransactionUsecase {
    constructor(private transactionRepo: TransactionRepo) {}

    async execute(dto: CreateTransactionDto): Promise<void> {
        const transaction = new TransactionEntity(Math.random().toString(), dto.date, dto.description, dto.amount, dto.type, dto.category, dto.user);
        return await this.transactionRepo.createTransaction(transaction);
    }
}

export default CreateTransactionUsecase;