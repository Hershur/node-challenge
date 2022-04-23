import { ApiError } from '@nc/utils/errors';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { getExpenseDetails, getUserExpenseDetails } from '../model';
import { secureTrimExpense, secureTrimUserExpense } from '../formatter';

export const router = Router();

router.get('/get-expense', async (req, res, next) => {
  const [expenseError, expenseDetails] = await to(getExpenseDetails(req.query?.expenseId));

  if (expenseError) {
    return next(new ApiError(expenseError, expenseError.status, `Could not get expense details: ${expenseError}`, expenseError.title, req));
  }

  if (!expenseDetails) {
    return res.json({});
  }

  return res.json(JSON.parse(secureTrimExpense(expenseDetails)));
})
  .get('/get-user-expense', async (req, res, next) => {
    const [expenseError, userExpenseDetails] = await to(getUserExpenseDetails(req.query?.userId));

    if (expenseError) {
      return next(new ApiError(expenseError, expenseError.status, `Could not get user expense details: ${expenseError}`, expenseError.title, req));
    }

    if (!userExpenseDetails) {
      return res.json({});
    }

    return res.json(JSON.parse(secureTrimUserExpense(userExpenseDetails)));
  });
