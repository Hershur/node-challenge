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
