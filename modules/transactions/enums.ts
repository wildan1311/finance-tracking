enum TRANSACTIONTYPE {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE"
}

const TransactionTypes = [
    {
        value: TRANSACTIONTYPE.INCOME.toString(),
        label: "Income"
    },
    {
        value: TRANSACTIONTYPE.EXPENSE.toString(),
        label: "Expense"
    }
];

export { TRANSACTIONTYPE, TransactionTypes };