import TransactionsClient from "@/components/dashboard/transaction-client";
import { createTransaction, getTransactions } from "./actions";


export default async function TransactionsPage() {
  const transactions = await getTransactions();
  const createTransactionServer = async (_prevState: any, formData: FormData) => {
    "use server"
    return await createTransaction(_prevState, formData);
  };

  return <TransactionsClient initialData={transactions} saveTransaction={createTransactionServer} />;
}