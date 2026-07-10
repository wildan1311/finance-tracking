import TransactionEntity from "@/modules/transactions/entity/TransactionEntity";
import { DexieTransactionRepo } from "@/modules/transactions/infra/DexieTransactionRepo";
import GoogleSheetTransactionRepo from "@/modules/transactions/infra/GoogleSheetTransactionRepo";
import GetTransactionUsecase from "@/modules/transactions/usecases/GetTransactionUsecase";

export async function getTransactions() : Promise<TransactionEntity[]> {
    try{
        const transactionRepo = new GoogleSheetTransactionRepo();
        const useCase = new GetTransactionUsecase(transactionRepo);
        return await useCase.execute();
    }catch(error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}