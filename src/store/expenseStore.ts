import { create } from 'zustand';
import { Expense } from '../models/Expense';

interface ExpenseState {
  //State
  expenses: Expense[];
  filteredExpenses: Expense[];
  searchText: string;
  selectedCategory: string | null;
  isSyncing: boolean;

  //Data manipulation actions
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  //Filter actions
  setSearchText: (text: string) => void;
  setSelectedCategory: (category: string | null) => void;

  //Sync
  setSyncing: (value: boolean) => void;
}

//Apply filters to the expenses based on search text and selected category
const applyFilters = (
  expenses: Expense[],
  searchText: string,
  selectedCategory: string | null
): Expense[] => {
  return expenses.filter((expense) => {
    const matchesCategory =
      selectedCategory === null || expense.category === selectedCategory;
    const matchesSearch =
      searchText === '' ||
      expense.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });
};

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  filteredExpenses: [],
  searchText: '',
  selectedCategory: null,
  isSyncing: false,

  setExpenses: (expenses) => {
    const { searchText, selectedCategory } = get();
    set({
      expenses: expenses,
      filteredExpenses: applyFilters(expenses, searchText, selectedCategory),
    });
  },

  addExpense: (expense) => {
    const { expenses, searchText, selectedCategory } = get();
    const updated = [expense, ...expenses];
    set({
      expenses: updated,
      filteredExpenses: applyFilters(updated, searchText, selectedCategory),
    });
  },

  deleteExpense: (id) => {
    const { expenses, searchText, selectedCategory } = get();
    const updated = expenses.filter((expense) => expense.id !== id);
    set({
      expenses: updated,
      filteredExpenses: applyFilters(updated, searchText, selectedCategory),
    });
  },

  setSearchText: (text) => {
    const { expenses, selectedCategory } = get();
    set({
      searchText: text,
      filteredExpenses: applyFilters(expenses, text, selectedCategory),
    });
  },

  setSelectedCategory: (category) => {
    const { expenses, searchText } = get();
    set({
      selectedCategory: category,
      filteredExpenses: applyFilters(expenses, searchText, category),
    });
  },

  setSyncing: (value) => set({ isSyncing: value }),
}));
