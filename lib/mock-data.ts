// Centralized sample data for the finance dashboard boilerplate.
// Swap these out for real API/database calls when wiring up a backend.

export type TransactionType = "income" | "expense"
export type TransactionStatus = "completed" | "pending" | "failed"

export type Transaction = {
  id: string
  date: string
  merchant: string
  category: string
  account: string
  amount: number // positive = income, negative = expense
  type: TransactionType
  status: TransactionStatus
}

export type Budget = {
  id: string
  category: string
  spent: number
  limit: number
}

export type Account = {
  id: string
  name: string
  type: string
  balance: number
  last4: string
}

export const stats = {
  totalBalance: 48250.75,
  totalBalanceChange: 12.4,
  income: 9820.0,
  incomeChange: 8.1,
  expenses: 5410.32,
  expensesChange: -3.2,
  savingsRate: 44.9,
  savingsRateChange: 5.6,
}

// 12 months of income vs expenses for the overview area chart.
export const monthlyFlow = [
  { month: "Jan", income: 7200, expenses: 4800 },
  { month: "Feb", income: 7600, expenses: 5100 },
  { month: "Mar", income: 8100, expenses: 4600 },
  { month: "Apr", income: 7900, expenses: 5300 },
  { month: "May", income: 8600, expenses: 4900 },
  { month: "Jun", income: 9100, expenses: 5600 },
  { month: "Jul", income: 8800, expenses: 5200 },
  { month: "Aug", income: 9400, expenses: 5800 },
  { month: "Sep", income: 9700, expenses: 5400 },
  { month: "Oct", income: 9200, expenses: 5100 },
  { month: "Nov", income: 9600, expenses: 5700 },
  { month: "Dec", income: 9820, expenses: 5410 },
]

export const spendingByCategory = [
  { category: "Housing", amount: 1850, fill: "var(--chart-1)" },
  { category: "Food", amount: 920, fill: "var(--chart-2)" },
  { category: "Transport", amount: 540, fill: "var(--chart-3)" },
  { category: "Shopping", amount: 780, fill: "var(--chart-4)" },
  { category: "Other", amount: 1320, fill: "var(--chart-5)" },
]

export const budgets: Budget[] = [
  { id: "b1", category: "Housing", spent: 1850, limit: 2000 },
  { id: "b2", category: "Food & Dining", spent: 920, limit: 1000 },
  { id: "b3", category: "Transport", spent: 540, limit: 500 },
  { id: "b4", category: "Shopping", spent: 780, limit: 1200 },
  { id: "b5", category: "Entertainment", spent: 310, limit: 400 },
  { id: "b6", category: "Utilities", spent: 425, limit: 450 },
]

export const accounts: Account[] = [
  { id: "a1", name: "Everyday Checking", type: "Checking", balance: 12480.5, last4: "4821" },
  { id: "a2", name: "High-Yield Savings", type: "Savings", balance: 31200.25, last4: "9034" },
  { id: "a3", name: "Travel Rewards Card", type: "Credit", balance: -1430.0, last4: "1177" },
  { id: "a4", name: "Brokerage", type: "Investment", balance: 6000.0, last4: "5567" },
]

export const transactions: Transaction[] = [
  { id: "t1", date: "2026-06-28", merchant: "Aurora Payroll", category: "Salary", account: "Everyday Checking", amount: 4820.0, type: "income", status: "completed" },
  { id: "t2", date: "2026-06-27", merchant: "Meridian Rent", category: "Housing", account: "Everyday Checking", amount: -1850.0, type: "expense", status: "completed" },
  { id: "t3", date: "2026-06-26", merchant: "Freshmart Grocery", category: "Food", account: "Travel Rewards Card", amount: -142.36, type: "expense", status: "completed" },
  { id: "t4", date: "2026-06-25", merchant: "Metro Transit", category: "Transport", account: "Travel Rewards Card", amount: -48.0, type: "expense", status: "completed" },
  { id: "t5", date: "2026-06-24", merchant: "Northwind Energy", category: "Utilities", account: "Everyday Checking", amount: -128.9, type: "expense", status: "pending" },
  { id: "t6", date: "2026-06-23", merchant: "Dividend Payout", category: "Investment", account: "Brokerage", amount: 320.0, type: "income", status: "completed" },
  { id: "t7", date: "2026-06-22", merchant: "Cloudline Streaming", category: "Entertainment", account: "Travel Rewards Card", amount: -17.99, type: "expense", status: "completed" },
  { id: "t8", date: "2026-06-21", merchant: "Peak Outfitters", category: "Shopping", account: "Travel Rewards Card", amount: -264.5, type: "expense", status: "completed" },
  { id: "t9", date: "2026-06-20", merchant: "Bluebottle Coffee", category: "Food", account: "Everyday Checking", amount: -6.75, type: "expense", status: "completed" },
  { id: "t10", date: "2026-06-19", merchant: "Freelance Invoice", category: "Salary", account: "Everyday Checking", amount: 1200.0, type: "income", status: "completed" },
  { id: "t11", date: "2026-06-18", merchant: "City Parking", category: "Transport", account: "Travel Rewards Card", amount: -22.0, type: "expense", status: "failed" },
  { id: "t12", date: "2026-06-17", merchant: "Harbor Insurance", category: "Utilities", account: "Everyday Checking", amount: -196.42, type: "expense", status: "completed" },
  { id: "t13", date: "2026-06-16", merchant: "Summit Gym", category: "Entertainment", account: "Everyday Checking", amount: -45.0, type: "expense", status: "completed" },
  { id: "t14", date: "2026-06-15", merchant: "Interest Earned", category: "Investment", account: "High-Yield Savings", amount: 88.14, type: "income", status: "completed" },
  { id: "t15", date: "2026-06-14", merchant: "Lumen Bookstore", category: "Shopping", account: "Travel Rewards Card", amount: -53.2, type: "expense", status: "completed" },
]

export function formatCurrency(value: number, opts?: { signed?: boolean }) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: opts?.signed ? "always" : "auto",
  }).format(value)
  return formatted
}
