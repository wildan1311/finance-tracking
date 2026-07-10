import { useEffect, useState } from "react";
import TransactionEntity from "@/modules/transactions/entity/TransactionEntity";
import { DexieTransactionRepo } from "@/modules/transactions/infra/DexieTransactionRepo";
import GetTransactionUsecase from "@/modules/transactions/usecases/GetTransactionUsecase";
import CreateTransactionUsecase from "@/modules/transactions/usecases/CreateTransactionUsecase";
import type {FilterPagination} from '@/modules/shared/FilterType';

export function useTransactionsLocal(FilterPagination: FilterPagination) {
  const [transactions, setTransactions] = useState<TransactionEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const repo = new DexieTransactionRepo();
  const useCase = new GetTransactionUsecase(repo);
  const createTransactionUsecase = new CreateTransactionUsecase(repo);

  useEffect(() => {
    async function load() {

      const data = await useCase.execute(FilterPagination);

      setTransactions(data);
      setLoading(false);
    }

    load();
  }, []);

  function createTransaction(transaction: TransactionEntity) {
    createTransactionUsecase.execute(transaction);
  }

  return {
    transactions,
    loading,
    createTransaction
  };
}