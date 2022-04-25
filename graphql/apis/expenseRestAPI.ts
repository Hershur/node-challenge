import httpService from './helpers/httpService';

export async function expenseDetails(expenseId) {
  const endpoint = `/expense/v1/get-expense?expenseId=${expenseId}`;
  const expenseResult = await httpService.get(endpoint);

  return expenseResult;
}

export async function userExpensesDetails(userId) {
  const endpoint = `/expense/v1/get-user-expenses?userId=${userId}`;
  const userExpensesResult = await httpService.get(endpoint);

  return userExpensesResult;
}

export async function getAllExpensesDetails({ page, size, sortBy, filter }) {
  const endpoint = `/expense/v1/get-all-expenses?page=${page}&size=${size}&sortBy=${sortBy}&filter=${filter}`;
  const allExpensesResult = await httpService.get(endpoint);

  return allExpensesResult;
}
