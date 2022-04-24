import { ApiError } from '@nc/utils/errors';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { Expense, UserExpense } from '../types';
import { getExpenseDetails, getUserExpensesDetails } from '../model';
import { publicFieldsExpense, publicFieldsUserExpense, secureTrim } from '../formatter';

export const router = Router();

router.get('/get-expense', async (req, res, next) => {
  const [expenseError, expenseDetails] = await to(getExpenseDetails(req.query?.expenseId));

  if (expenseError) {
    return next(new ApiError(expenseError, expenseError.status, `Could not get expense details: ${expenseError}`, expenseError.title, req));
  }

  if (!expenseDetails) {
    return res.json({});
  }

  return res.json(JSON.parse(secureTrim<Expense>(expenseDetails, publicFieldsExpense)));
})
  .get('/get-user-expenses', async (req, res, next) => {
    const [expenseError, userExpenseDetails] = await to(getUserExpensesDetails(req.query?.userId));

    if (expenseError) {
      return next(new ApiError(expenseError, expenseError.status, `Could not get user expense details: ${expenseError}`, expenseError.title, req));
    }

    if (!userExpenseDetails) {
      return res.json({});
    }

    return res.json(JSON.parse(secureTrim<UserExpense[]>(userExpenseDetails, publicFieldsUserExpense)));
  });
