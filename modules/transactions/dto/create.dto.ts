export interface CreateTransactionDto {
  date: Date;
  description: string;
  amount: number;
  type: string;
  category: string;
  user: string;
}