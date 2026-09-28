import { revalidatePath } from "next/cache";
import ResponseMaker from "@/modules/shared/application/ResponseMaker";
import { PaginationResult } from "@/modules/shared/domain/PaginationHelper";
import CreateTransaction from "@/modules/transactions/application/usecases/CreateTransaction";
import GetTransactions from "@/modules/transactions/application/usecases/GetTransactions";
import Transaction from "@/modules/transactions/domain/entities/Transaction";
import GoogleSheetTransactionRepository from "@/modules/transactions/infrastructure/repositories/GoogleSheetTransactionRepository";
import { createTransactionSchema } from "@/modules/transactions/presentation/schemas/transaction.schema";
import { redirect } from "next/navigation";

export async function getTransactions(): Promise<PaginationResult<Transaction>> {
  try {
    const useCase = new GetTransactions(new GoogleSheetTransactionRepository());
    return await useCase.execute();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function createTransaction(_prevState: unknown, formData: FormData) {
  try {
    const dto = {
      date: formData.get("date"),
      description: formData.get("description"),
      amount: Number(formData.get("amount")?.toString().replace(/[^0-9]+/g, "")),
      type: formData.get("type"),
      category: formData.get("category"),
      user: formData.get("user"),
    };

    const forms = createTransactionSchema.safeParse(dto);

    if (!forms.success) {
      return ResponseMaker.makeValidationErrorResponse(
        "Invalid transaction data",
        forms.error.flatten().fieldErrors,
        dto,
      );
    }

    const { date, description, amount, type, category, user } = forms.data;

    const useCase = new CreateTransaction(new GoogleSheetTransactionRepository());
    await useCase.execute({ date, description, amount, type, category, user });

    revalidatePath("/transactions");
    return ResponseMaker.makeSuccessResponse("Transaction created successfully");
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}
