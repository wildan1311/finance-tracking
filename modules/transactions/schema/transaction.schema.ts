import z from "zod"
import { TRANSACTIONTYPE } from "../enums";

const createTransactionSchema = z.object({
    date: z.coerce.date(),
    description: z.string().max(255).nonempty("Deskripsi wajib diisi"),
    amount: z.number().positive("Jumlah harus berupa angka positif"),
    type: z.enum([TRANSACTIONTYPE.INCOME.toString(), TRANSACTIONTYPE.EXPENSE.toString()]),
    category: z.string().max(100).nonempty("Kategori wajib diisi"),
    user: z.string().max(255).nonempty("User wajib diisi"),
});

export {createTransactionSchema}