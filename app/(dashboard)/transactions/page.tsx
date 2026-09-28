import TransactionsClient from "@/modules/transactions/presentation/components/TransactionsClient";
import {
  createTransaction,
  getTransactions,
} from "@/modules/transactions/presentation/actions/transactions.actions";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  const createTransactionServer = async (
    _prevState: unknown,
    formData: FormData,
  ) => {
    "use server";
    return await createTransaction(_prevState, formData);
  };

  return (
    <TransactionsClient
      initialData={transactions}
      saveTransaction={createTransactionServer}
    />
  );
}