import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useExpenseStore } from '../store/expenseStore';
import { useAuthStore } from '../store/authStore';
import { Expense } from '../models/Expense';
import { ExpensesStackParamList } from '../navigation/AppNavigator';
import {
  initDatabase,
  fetchExpenses,
  deleteExpenseById,
} from '../services/SQLiteService';
import { deleteAllExpensesForUser } from '../services/SQLiteService';
import ExpenseRow from '../components/ui/ExpensesRow';
import CategoryChip from '../components/ui/CategoryChip';
import EmptyState from '../components/ui/EmptyState';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseList'>;

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Other'];

export default function ExpenseListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const {
    filteredExpenses,
    searchText,
    selectedCategory,
    isSyncing,
    setExpenses,
    deleteExpense,
    setSearchText,
    setSelectedCategory,
    setSyncing,
  } = useExpenseStore();

  //Charge expenses from SQLite when the component mounts
  const loadExpenses = useCallback(async () => {
    if (!user) return;
    await initDatabase();
    const expenses = await fetchExpenses(user.uid);
    setExpenses(expenses);
  }, [user, setExpenses]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  //Delete expense from SQLite + Firestore + store
  const handleDelete = async (expense: Expense) => {
    if (!user) return;
    await deleteExpenseById(expense.id, user.uid); //delete from SQLite
    deleteExpense(expense.id); //delete from store
  };

  //Confirm delete with Alert
  const confirmDelete = (expense: Expense) => {
    Alert.alert(
      t('expenses.delete'),
      expense.title,
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('expenses.delete'),
          style: 'destructive',
          onPress: () => handleDelete(expense),
        },
      ]
    );
  };


  //Each row in the FlatList
  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseRow
      expense={item}
      onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
      onLongPress={() => confirmDelete(item)}
    />
  );

  return (
    <View style={styles.container}>

      {/*Header*/}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('expenses.title')}</Text>
        <View style={styles.headerActions}>
          {/*Add*/}
          <TouchableOpacity
            onPress={() => navigation.navigate('AddExpense')}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*Search*/}
      <TextInput
        style={styles.search}
        placeholder={t('expenses.search_placeholder')}
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#8E8E93"
        clearButtonMode="while-editing"
      />

      {/*Category filter*/}
      <FlatList
        data={CATEGORIES}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 48 }}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <CategoryChip
            label={t(`categories.${item}`)}
            active={selectedCategory === item}
            onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}
          />
        )}
      />

      {/*Expenses list*/}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          filteredExpenses.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={<EmptyState message={t('expenses.empty')} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  search: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#000',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 4, 
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  separator: {
    height: 0,
  },
});