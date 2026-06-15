import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

interface Props {
  category: string;
  badgeColor: string;
  style?: ViewStyle;
}

const NativeCategoryBadgeView = requireNativeComponent<Props>('CategoryBadgeView');

export default function CategoryBadgeView({ category, badgeColor, style }: Props) {
  return (
    <NativeCategoryBadgeView
      category={category}
      badgeColor={badgeColor}
      style={style}
    />
  );
}