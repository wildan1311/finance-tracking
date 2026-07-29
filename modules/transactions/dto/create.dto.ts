import { TRANSACTIONTYPE } from "../enums";

export interface CreateTransactionDto {
  date: Date;
  description: string;
  amount: number;
  type: string;
  category: string;
}