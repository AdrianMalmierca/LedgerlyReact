import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Expense } from '../../models/Expense';

interface Props {
  expense: Expense;
  onPress: () => void;
  onLongPress: () => void;
}

export default function ExpenseRow({ expense, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={styles.title} numberOfLines={1}>{expense.title}</Text>
        <Text style={styles.category}>{expense.category}</Text>
      </View>
      <Text style={styles.amount}>
        {expense.amount.toFixed(2)} €
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  category: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});