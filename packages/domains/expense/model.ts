import { to } from '@nc/utils/async';
import { BadRequest, InternalError, NotFound } from '@nc/utils/errors';
import { Expense, PaginatedExpenses, UserExpense } from './types';
import { formatExpense, formatExpenses, formatUserExpenses } from './formatter';
import { getAllExpenses, getExpense, getUserExpenses } from './data/db-expense';

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

export async function getUserExpensesDetails(userId): Promise<UserExpense[]> {
  if (!userId) {
    throw BadRequest('userId property is missing.');
  }

  const [dbError, rawUserExpense] = await to(getUserExpenses(userId));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  if (!rawUserExpense.length) {
    throw NotFound(`Could not find user with id ${userId}`);
  }

  return formatUserExpenses(rawUserExpense);
}

export async function getAllExpensesDetails({ page = '1', size, sortBy, filter }): Promise<PaginatedExpenses> {
  const [dbError, rawAllExpenses] = await to(getAllExpenses({ page, size, sortBy, filter }));

  const validSort = ['merchant_name', 'currency', 'status', 'amount_in_cents', 'date_created'];
  const checkSortBy = sortBy.trim().split(',').every((x) => validSort.includes(x));

  if (sortBy && !checkSortBy) {
    throw BadRequest(`invalid sort, only ${[...validSort]} is allowed`);
  }

  if (parseInt(page, 10) < 1) {
    throw BadRequest('page number cannot be less than 1');
  }

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  if (!rawAllExpenses.length) {
    throw NotFound('Could not find any result');
  }

  return {
    page: parseInt(page, 10),
    size: size || parseInt(rawAllExpenses.length, 10),
    recordsDisplayed: rawAllExpenses.length,
    totalRecords: parseInt(rawAllExpenses[0]?.full_count, 10),
    sortBy,
    data: rawAllExpenses[0]?.id ? formatExpenses(rawAllExpenses) : [],
  };
}
