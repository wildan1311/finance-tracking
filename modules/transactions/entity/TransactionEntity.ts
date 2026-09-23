export type TypeTransaction = "INCOME" | "EXPENSE";

class TransactionEntity {
    constructor(
        public id: string,
        public date: Date,
        public description: string,
        public amount: number,
        public type: string,
        public category: string,
        public user: string
    ) {}
}

export default TransactionEntity;