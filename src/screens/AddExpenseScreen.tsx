import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore } from '../store/expenseStore';
import { Expense, CATEGORIES } from '../models/Expense';
import { ExpensesStackParamList } from '../navigation/AppNavigator';
import { insertExpense } from '../services/SQLiteService';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'AddExpense'>;

export default function AddExpenseScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { addExpense } = useExpenseStore();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Other');

  //Declarative animation with Reanimated
  //Animation scale: the button "press" when save
  const scale = useSharedValue(1); //1 is the default scale, 1.15 is the "pressed" scale
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = title.trim() === '' || amount.trim() === '';

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!user) return;

    const newExpense: Expense = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: title.trim(),
      amount: parsedAmount,
      date: new Date().toISOString(),
      category,
      userId: user.uid,
    };

      scale.value = withSequence(
        withSpring(1.15, { damping: 4, stiffness: 200 }),
        withSpring(1, { damping: 6, stiffness: 200 })
      );

    try {
      await insertExpense(newExpense);
      addExpense(newExpense);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save the expense');
    }
  };

  return (
    <KeyboardAvoidingView //so the keyboard doesn't cover the inputs
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} //on iOS, add bottom padding, push the view up, 
      // on Android it will reduce the height of the view
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" //so the keyboard doesn't cover the inputs, and when tapping outside the keyboard, it will dismiss the keyboard
      >
        {/*Modal header*/}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>{t('add_expense.close')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('add_expense.title')}</Text>
          {/*Save button with animation*/}
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isDisabled}
            >
              <Text style={[styles.saveButton, isDisabled && styles.saveButtonDisabled]}>
                {t('add_expense.save')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/*Details section*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('add_expense.section_details')}</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder={t('add_expense.field_title')}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#8E8E93"
              returnKeyType="next"
            />
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.input}
              placeholder={t('add_expense.field_amount')}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#8E8E93"
              returnKeyType="done"
            />
          </View>
        </View>

        {/*Category section*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('add_expense.section_category')}</Text>
          <View style={styles.card}>
            {CATEGORIES.map((cat, index) => (
              <View key={cat}>
                <TouchableOpacity
                  style={styles.categoryRow}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={styles.categoryLabel}>
                    {t(`categories.${cat}`)}
                  </Text>
                  {category === cat && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
                {index < CATEGORIES.length - 1 && (
                  <View style={styles.inputDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  saveButtonDisabled: {
    color: '#C7C7CC',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  inputDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#000',
  },
  checkmark: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
});