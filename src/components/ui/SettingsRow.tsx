import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
  value?: string;
  right?: React.ReactNode;
}

export default function SettingsRow({ label, onPress, destructive, value, right }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.label, destructive && styles.destructive]}>{label}</Text>
      {right ?? (value ? <Text style={styles.value}>{value}</Text> : null)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  destructive: {
    color: '#FF3B30',
  },
  value: {
    fontSize: 16,
    color: '#8E8E93',
  },
});