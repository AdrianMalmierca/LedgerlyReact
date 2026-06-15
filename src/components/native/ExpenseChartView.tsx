import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

interface Props {
  data: Record<string, number>;
  style?: ViewStyle;
}

const NativeExpenseChartView = requireNativeComponent<Props>('ExpenseChartView');

export default function ExpenseChartView({ data, style }: Props) {
  return <NativeExpenseChartView data={data} style={style} />;
}