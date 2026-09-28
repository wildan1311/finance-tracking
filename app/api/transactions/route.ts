import GoogleSheetTransactionRepository from "@/modules/transactions/infrastructure/repositories/GoogleSheetTransactionRepository";
import GetTransactions from "@/modules/transactions/application/usecases/GetTransactions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const q = searchParams.get("q") ?? "";
  const offset = searchParams.get("offset") ?? "0";
  const page = searchParams.get("page") ?? "1";

  try {
    const repo = new GoogleSheetTransactionRepository();
    const useCase = new GetTransactions(repo);

    const transactions = await useCase.execute({
      size: Number(offset),
      page: Number(page),
      q: String(q),
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}