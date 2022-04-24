import { Arg, Query, Resolver } from 'type-graphql';
import { expenseDetails, userExpensesDetails } from '../apis/expenseRestAPI';

@Resolver()
export class ExpenseResolver {
  @Query(() => String)
  async expense(@Arg('expenseId', () => String) expenseId: string) {
    const result = await expenseDetails(expenseId);
    return JSON.stringify(result);
  }

  @Query(() => String)
  async userExpenses(@Arg('userId', () => String) userId: string) {
    const result = await userExpensesDetails(userId);
    return JSON.stringify(result);
  }
}
