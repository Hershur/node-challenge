import { query } from '@nc/utils/db';

export function getExpense(expenseId) {
  return query('SELECT * FROM expenses WHERE id = $1', [expenseId])
    .then((response) => response.rows?.[0]);
}

export function getUserExpenses(userId) {
  return query(`
        SELECT users.id as user_id, CONCAT_WS(' ', first_name, last_name) as full_name, 
        merchant_name, currency, amount_in_cents, status, date_created
        FROM expenses 
        LEFT JOIN users ON users.id = expenses.user_id
        WHERE user_id = $1`,
  [userId])
    .then((response) => response.rows);
}

export function getAllExpenses({ page, size, sortBy, filter }) {
  return query(`
        WITH cte AS (
            SELECT *
            FROM   expenses
            ${filter && `WHERE merchant_name = '${filter}' OR currency = '${filter}' OR status = '${filter}'`}
            )
        SELECT *
        FROM  (
            TABLE  cte
            ORDER  BY ${sortBy ? `${sortBy}` : 'id'}
            LIMIT $2
                OFFSET (($1 - 1) * $2)
            ) sub
        RIGHT  JOIN (SELECT count(*) FROM cte) c(full_count) ON true;
    `,
  [page, size])
    .then((response) => response.rows);
}
