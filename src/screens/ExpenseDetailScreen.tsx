import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useExpenseStore } from '../store/expenseStore';
import { ExpensesStackParamList } from '../navigation/AppNavigator';
import CategoryBadgeView from '../components/native/CategoryBadgeView';
import { fetchExchangeRates, convertAmount, ExchangeRates } from '../services/CurrencyService';
import { useState, useEffect } from 'react';

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseDetail'>;

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF9500',
  Transport: '#007AFF',
  Bills: '#FF3B30',
  Other: '#8E8E93',
};


export default function ExpenseDetailScreen({ route }: Props) {
  const { t } = useTranslation();
  const { expenseId } = route.params;

  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(false);

  useEffect(() => {
    setRatesLoading(true);
    setRatesError(false);
    fetchExchangeRates()
      .then(setRates)
      .catch(() => setRatesError(true))
      .finally(() => setRatesLoading(false));
  }, []);

  const expense = useExpenseStore((state) =>
    state.expenses.find((e) => e.id === expenseId)
  );

  if (!expense) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>{t('expenses.not_found')}</Text>
      </View>
    );
  }

  const formattedDate = new Date(expense.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} bounces={false}>

      {/*Purple banner with total amount*/}
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>{t('detail.total_amount')}</Text>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>{expense.amount.toFixed(2)}</Text>
          <Text style={styles.currency}> €</Text>
        </View>
      </View>

      {/*Detail card*/}
      <View style={styles.card}>

        {/*Title and category badge*/}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{expense.title}</Text>
          <CategoryBadgeView
            category={t(`categories.${expense.category}`)}
            badgeColor={CATEGORY_COLORS[expense.category] ?? '#8E8E93'}
            style={{ height: 28, width: 100, marginTop: 4 }}
          />
        </View>

        <View style={styles.divider} />

        {/*Date row*/}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('detail.date')}</Text>
          <Text style={styles.detailValue}>{formattedDate}</Text>
        </View>

        <View style={styles.divider} />

        {/*Category row*/}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('detail.category')}</Text>
          <Text style={styles.detailValue}>
            {t(`categories.${expense.category}`)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('currency.title')}</Text>
        {ratesLoading && <Text style={styles.rateText}>{t('currency.loading')}</Text>}
        {ratesError && <Text style={styles.rateText}>{t('currency.error')}</Text>}
        {rates && expense && (
          <View style={styles.ratesCard}>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>USD</Text>
              <Text style={styles.rateValue}>
                {convertAmount(expense.amount, rates.USD)} $
              </Text>
            </View>
            <View style={styles.rateDivider} />
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>GBP</Text>
              <Text style={styles.rateValue}>
                {convertAmount(expense.amount, rates.GBP)} £
              </Text>
            </View>
            <View style={styles.rateDivider} />
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>JPY</Text>
              <Text style={styles.rateValue}>
                {convertAmount(expense.amount, rates.JPY)} ¥
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  banner: {
    backgroundColor: '#6f2dff',
    paddingTop: 40,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bannerLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 44,
    fontWeight: '500',
    color: '#fff',
  },
  currency: {
    fontSize: 24,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: -16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 15,
    color: '#000',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  ratesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rateDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  rateLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  rateValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  rateText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
});