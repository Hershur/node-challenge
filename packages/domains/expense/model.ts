import { to } from '@nc/utils/async';
import { BadRequest, InternalError, NotFound } from '@nc/utils/errors';
import { Expense, UserExpense } from './types';
import { formatExpense, formatUserExpense } from './formatter';
import { getExpense, getUserExpenses } from './data/db-expense';

export async function getExpenseDetails(expenseId): Promise<Expense> {
  if (!expenseId) {
    throw BadRequest('expenseId property is missing.');
  }

  const [dbError, rawExpense] = await to(getExpense(expenseId));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  if (!rawExpense) {
    throw NotFound(`Could not find expense with id ${expenseId}`);
  }

  return formatExpense(rawExpense);
}

export async function getUserExpenseDetails(userId): Promise<UserExpense> {
  if (!userId) {
    throw BadRequest('userId property is missing.');
  }

  const [dbError, rawUserExpense] = await to(getUserExpenses(userId));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  if (!rawUserExpense) {
    throw NotFound(`Could not find user with id ${userId}`);
  }

  return formatUserExpense(rawUserExpense);
}
