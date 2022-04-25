import { ApiError } from '@nc/utils/errors';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { Expense, PaginatedExpenses, UserExpense } from '../types';
import { getAllExpensesDetails, getExpenseDetails, getUserExpensesDetails } from '../model';
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
  })
  .get('/get-all-expenses', async (req, res, next) => {
    const buildQueries = {
      page: req.query?.page?.toString(),
      size: !req.query?.size || parseInt(req.query?.size.toString(), 10) > 10 ? 10 : parseInt(req.query?.size.toString(), 10),
      sortBy: req.query?.sortBy?.toString()?.trim(),
      filter: req.query?.filter,
    };

    const [expenseError, allExpenseDetails] = await to(getAllExpensesDetails(buildQueries));

    if (expenseError) {
      return next(new ApiError(expenseError, expenseError.status, `Could not get user expense details: ${expenseError}`, expenseError.title, req));
    }

    if (!allExpenseDetails) {
      return res.json({});
    }

    return res.json(JSON.parse(secureTrim<PaginatedExpenses>(allExpenseDetails)));
  });
