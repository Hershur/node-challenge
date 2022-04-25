import { Field, InputType } from 'type-graphql';

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

export interface PaginatedExpenses {
    page: number
    size: number
    sortBy?: string
    recordsDisplayed: number
    totalRecords: number
    data: Expense[]
}
@InputType()
export class PaginationArgs {
    @Field(() => String)
    page: string;

    @Field(() => String)
    size: string;

    @Field(() => String)
    sortBy: string;

    @Field(() => String)
    filter: string;
}
