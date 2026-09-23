import { PaginationResult } from "@/lib/PaginationHelper";
import ResponseMaker from "@/lib/ResponseMaker";
import { CreateTransactionDto } from "@/modules/transactions/dto/create.dto";
import TransactionEntity from "@/modules/transactions/entity/TransactionEntity";
import { DexieTransactionRepo } from "@/modules/transactions/infra/DexieTransactionRepo";
import GoogleSheetTransactionRepo from "@/modules/transactions/infra/GoogleSheetTransactionRepo";
import { createTransactionSchema } from "@/modules/transactions/schema/transaction.schema";
import CreateTransactionUsecase from "@/modules/transactions/usecases/CreateTransactionUsecase";
import GetTransactionUsecase from "@/modules/transactions/usecases/GetTransactionUsecase";
import { revalidatePath } from "next/cache";

export async function getTransactions(): Promise<PaginationResult<TransactionEntity>> {
  try {
    const transactionRepo = new GoogleSheetTransactionRepo();
    const useCase = new GetTransactionUsecase(transactionRepo);
    return await useCase.execute();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function createTransaction(
    _prevState: any,
    formData: FormData) {
  try {
    const dto = {
      date: formData.get("date"),
      description: formData.get("description"),
      amount: Number(formData.get("amount")?.toString().replace(/[^0-9]+/g,"")),
      type: formData.get("type"),
      category: formData.get("category"),
      user: formData.get("user"),
    };

    const forms = createTransactionSchema.safeParse(dto);
    if (!forms.success) {
        return ResponseMaker.makeValidationErrorResponse("Invalid transaction data", forms.error.flatten().fieldErrors, dto);
    }
    const { date, description, amount, type, category, user } = forms.data;
    const transactionRepo = new GoogleSheetTransactionRepo();
    const useCase = new CreateTransactionUsecase(transactionRepo);
    await useCase.execute({ date, description, amount, type, category, user });
    revalidatePath("/transactions");
    return ResponseMaker.makeSuccessResponse("Transaction created successfully");
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}
