import TransactionsClient from "@/components/dashboard/transaction-client";
import { getTransactions } from "./actions";


export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return <TransactionsClient initialData={transactions} />;
}