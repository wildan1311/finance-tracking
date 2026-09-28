import { TypeTransaction } from "@/modules/transactions/domain/entities/Transaction";

export interface CreateTransactionDto {
  date: Date;
  description: string;
  amount: number;
  type: TypeTransaction;
  category: string;
  user: string;
}
