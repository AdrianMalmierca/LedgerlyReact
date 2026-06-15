import SQLite from 'react-native-sqlite-2';
import { Expense } from '../models/Expense';

const db: any = SQLite.openDatabase(
  'ledgerly.db', //db name
  '1.0', 
  'Ledgerly Database', //description
  200000 //size in bytes
);

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          category TEXT NOT NULL,
          userId TEXT NOT NULL
        );`,
        [],
        () => resolve(),
        (_: any, error: any) => { //we dont use the first parameter (tx), so we name it _ to avoid linter warnings
          reject(error);
          return true;
        }
      );
    });
  });
};

export const fetchExpenses = (userId: string): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM expenses WHERE userId = ? ORDER BY date DESC;',
        [userId],
        (_: any, result: any) => {
          const expenses: Expense[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            expenses.push(result.rows.item(i));
          }
          resolve(expenses);
        },
        (_: any, error: any) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const insertExpense = (expense: Expense): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO expenses (id, title, amount, date, category, userId)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [ //ignore in case the expense already exists (based on id)
          expense.id,
          expense.title,
          expense.amount,
          expense.date,
          expense.category,
          expense.userId,
        ],
        () => resolve(),
        (_: any, error: any) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const deleteExpenseById = (id: string, userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM expenses WHERE id = ? AND userId = ?;',
        [id, userId],
        () => resolve(),
        (_: any, error: any) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const deleteAllExpensesForUser = (userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM expenses WHERE userId = ?;',
        [userId],
        () => resolve(),
        (_: any, error: any) => {
          reject(error);
          return true;
        }
      );
    });
  });
};