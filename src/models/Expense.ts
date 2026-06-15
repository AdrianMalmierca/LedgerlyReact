export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; //easier to serialize and deserialize as string in Sqlite and firebase
  category: string;
  userId: string;
}

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Other'] as const;
export type Category = typeof CATEGORIES[number];
