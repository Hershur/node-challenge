import { Expense, UserExpense } from './types';

const publicFields = [
  'amount',
  'currency',
  'status',
  'merchant_name',
  'date_created',
];
const publicFieldsExpense = ['full_name', ...publicFields.filter((f) => !['id'].includes(f))];

export function capitalizeEachWord(word) {
  return word.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function secureTrimExpense(expense: Expense): string {
  return JSON.stringify(expense, publicFields);
}

export function secureTrimUserExpense(expense: UserExpense): string {
  return JSON.stringify(expense, publicFieldsExpense);
}

export function formatExpense(rawExpense): Expense {
  return {
    id: rawExpense.id,
    merchant_name: rawExpense.merchant_name,
    amount: `${rawExpense.currency.toUpperCase()} ${(+rawExpense.amount_in_cents / 100).toLocaleString()}`,
    currency: rawExpense.currency.toUpperCase(),
    user_id: rawExpense.user_id,
    date_created: rawExpense.date_created,
    status: rawExpense.status,
  };
}

export function formatUserExpense(rawExpense): UserExpense {
  return rawExpense.map((expense) => (
    {
      user_id: expense.user_id,
      full_name: capitalizeEachWord(expense.full_name),
      amount: `${expense.currency.toUpperCase()} ${(+expense.amount_in_cents / 100).toLocaleString()}`,
      currency: expense.currency.toUpperCase(),
      merchant_name: expense.merchant_name,
      status: expense.status,
      date_created: expense.date_created,
    }
  ));
}
