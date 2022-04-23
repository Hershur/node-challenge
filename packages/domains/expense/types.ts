export interface Expense {
    id: string
    merchant_name: string
    amount: string
    currency: string
    user_id: string
    date_created: string
    status: string
}

type CleanedExpense = Omit<Expense, 'id' >;

export interface UserExpense extends CleanedExpense {
    full_name: string
}
