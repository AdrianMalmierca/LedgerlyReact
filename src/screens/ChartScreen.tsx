import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { useExpenseStore } from '../store/expenseStore';
import { useFocusEffect } from '@react-navigation/native';
import ExpenseChartView from '../components/native/ExpenseChartView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_MAX_HEIGHT = 180;
const CATEGORY_COLORS: Record<string, string> = {
  Food: '#007AFF',
  Transport: '#FF9500',
  Bills: '#AF52DE',
  Other: '#8E8E93',
};

//Component for individual bar animation — imperative animation with Reanimated
function AnimatedBar({
  value,
  maxValue,
  color,
  label,
  total,
  index,
}: {
  value: number;
  maxValue: number;
  color: string;
  label: string;
  total: number;
  index: number;
}) {
  const { t } = useTranslation();
  const heightProgress = useSharedValue(0);

  //On mount, animate the bar from 0 to its actual height with a staggered delay
  //This is the IMPERATIVE animation: we control the value directly
  useFocusEffect(
    React.useCallback(() => {
      heightProgress.value = 0; //reset the heightProgress to 0 when the component is focused, so it will animate again 
      // when navigating back to this screen
      heightProgress.value = withDelay(
        index * 120, //each bar will start animating 120ms after the previous one
        withTiming(1, { duration: 500 }) //animate from 0 to 1 in 500ms, which will be used to scale the height of the bar
      );
    }, [heightProgress, index])
  );

  //Calculate the height of the bar based on the value and maxValue, and apply the animated height
  const barHeight = maxValue > 0 ? (value / maxValue) * BAR_MAX_HEIGHT : 0;

  const animatedBarStyle = useAnimatedStyle(() => ({
    //heightProgress.value will go from 0 to 1, and we multiply it by the actual barHeight to animate the height
    //so the bar increase from the bottom to the top, like a "growing" effect
    height: barHeight * heightProgress.value,
  }));

  return (
    //Declarative animation with Reanimated: FadeInDown for the whole bar, staggered by index
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={styles.barWrapper}
    >
      <Text style={styles.barAmount}>{value.toFixed(0)} €</Text>
      <View style={styles.barTrack}>
        <Animated.View
          style={[styles.bar, { backgroundColor: color }, animatedBarStyle]}
        />
      </View>
      <Text style={styles.barLabel}>{t(`categories.${label}`)}</Text>
      <Text style={styles.barPercent}>
        {total > 0 ? ((value / total) * 100).toFixed(0) : 0}%
      </Text>
    </Animated.View>
  );
}

export default function ChartScreen() {
  const { t } = useTranslation();
  const { expenses } = useExpenseStore();

  //Group expenses by category and calculate totals, using reduce to create an object where keys are categories and 
  // values are the total amounts, thats why we use Record<string, number> as the type of the accumulator
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {}); //{} is the initial value of the accumulator, an empty object to hold category totals

  const translatedData = Object.entries(categoryTotals).reduce<Record<string, number>>(
    (acc, [key, value]) => {
      acc[t(`categories.${key}`)] = value;
      return acc;
    },
    {}
  );

  const categories = Object.keys(CATEGORY_COLORS);
  const totals = categories.map((cat) => categoryTotals[cat] || 0); //[cat] is the key to access the value in the object, if it doesn't exist, we return 0
  const maxValue = Math.max(...totals, 1); //the minimum maxValue is 1 to avoid division by zero
  const grandTotal = totals.reduce((a, b) => a + b, 0); //sum all the totals to get the grand total, 0 is the initial value

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F2F2F7' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 24, marginTop: 56 }}>
        {t('chart.title')}
      </Text>
      {/*Chart with react native*/}
      <View style={styles.chartCard}>
        <View style={styles.chart}>
          {categories.map((cat, index) => (
            <AnimatedBar
              key={cat}
              value={categoryTotals[cat] || 0}
              maxValue={maxValue}
              color={CATEGORY_COLORS[cat]}
              label={cat}
              total={grandTotal}
              index={index}
            />
          ))}
        </View>
      </View>

      {/*Native view*/}
      <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 24, marginBottom: 8, color: '#000' }}>
        {t('chart.native_title')}
      </Text>
      <ExpenseChartView
        data={translatedData}
        style={{ width: '100%', height: 260, backgroundColor: '#fff', borderRadius: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: BAR_MAX_HEIGHT + 80,
  },
  barWrapper: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 72) / 4,
  },
  barAmount: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 4,
  },
  barTrack: {
    width: 36,
    height: BAR_MAX_HEIGHT,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#3C3C43',
    marginTop: 6,
    fontWeight: '500',
  },
  barPercent: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  }
});