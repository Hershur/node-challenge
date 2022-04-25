import { Expense } from '../types';
import { capitalizeEachWord, formatExpense, formatExpenses, publicFieldsExpense, secureTrim } from '../formatter';

describe('[Packages | Expense-domain | Formatter] capitalize', () => {
  test('capitalize should make the first character of each word as a capital letter', () => {
    return expect(capitalizeEachWord('mario gomez')).toEqual('Mario Gomez');
  });

  test('capitalize capitalize second word in lowercase', () => {
    return expect(capitalizeEachWord('Clemence strobl')).toEqual('Clemence Strobl');
  });

  test('capitalize should do nothing on numbers', () => {
    return expect(capitalizeEachWord(123)).toEqual('123');
  });

  test('capitalize should do nothing on strings of numbers', () => {
    return expect(capitalizeEachWord('123')).toEqual('123');
  });
});

describe('[Packages | Expense-domain | Formatter] secureTrim', () => {
  test('secureTrim should remove fields that are not defined in the list of public fields', () => {
    return expect(secureTrim<Expense>({
      id: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
      user_id: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
      amount: 'DKK 80',
      currency: 'DKK',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    }, publicFieldsExpense)).toEqual(JSON.stringify({
      amount: 'DKK 80',
      currency: 'DKK',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    }));
  });
});

describe('[Packages | Expense-domain | Formatter] formatExpense', () => {
  test('format should return an instance of expense that fits the API model, based on the db raw value', () => {
    return expect(formatExpense({
      id: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
      user_id: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
      amount_in_cents: '8000',
      currency: 'dkk',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    })).toEqual({
      id: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
      user_id: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
      amount: 'DKK 80',
      currency: 'DKK',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    });
  });
});

describe('[Packages | Expense-domain | Formatter] formatExpenses', () => {
  test('format should return an instance of expense that fits the API model, based on the db list raw value', () => {
    return expect(formatExpenses([{
      id: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
      user_id: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
      amount_in_cents: '8000',
      currency: 'dkk',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    }, {
      id: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
      user_id: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
      amount_in_cents: '1500000',
      currency: 'gbp',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    }])).toEqual([{
      id: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
      user_id: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
      amount: 'DKK 80',
      currency: 'DKK',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    }, {
      id: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
      user_id: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
      amount: 'GBP 15,000',
      currency: 'GBP',
      status: 'pending',
      merchant_name: 'Cafe 22',
      date_created: '2021-09-21T19:57:40.021Z',
    }]);
  });
});
