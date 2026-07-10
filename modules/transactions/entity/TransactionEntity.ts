export type TypeTransaction = "income" | "expense";

class TransactionEntity {
    constructor(
        public id: string,
        public date: Date,
        public description: string,
        public amount: number,
        public type: TypeTransaction,
        public category: string
    ) {}
}

export default TransactionEntity;