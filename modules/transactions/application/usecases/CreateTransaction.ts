import { CreateTransactionDto } from "@/modules/transactions/domain/dto/CreateTransactionDto";
import Transaction from "@/modules/transactions/domain/entities/Transaction";
import TransactionRepository from "@/modules/transactions/domain/repositories/TransactionRepository";

class CreateTransaction {
  constructor(private transactionRepo: TransactionRepository) {}

  async execute(dto: CreateTransactionDto): Promise<void> {
    // The sheet generates the row id, so the placeholder here is never persisted.
    const transaction = new Transaction(
      Math.random().toString(),
      dto.date,
      dto.description,
      dto.amount,
      dto.type,
      dto.category,
      dto.user,
    );

    return await this.transactionRepo.createTransaction(transaction);
  }
}

export default CreateTransaction;
