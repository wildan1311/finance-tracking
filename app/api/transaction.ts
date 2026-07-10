import GoogleSheetTransactionRepo from "@/modules/transactions/infra/GoogleSheetTransactionRepo";
import GetTransactionUsecase from "@/modules/transactions/usecases/GetTransactionUsecase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const repo = new GoogleSheetTransactionRepo()
    const useCase = new GetTransactionUsecase(repo);

    const {q, offset, page, type} = req.query;

    const transactions = await useCase.execute({size: Number(offset), page: Number(page), q: String(q)});

    res.status(200).json(transactions);
}