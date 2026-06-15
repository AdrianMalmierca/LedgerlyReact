import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore } from '../store/expenseStore';
import { deleteAllExpensesForUser } from '../services/SQLiteService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsRow from '../components/ui/SettingsRow';
import NotificationModule from '../modules/NotificationModule';
import DeviceInfoModule from '../modules/DeviceInfoModule';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const { setExpenses } = useExpenseStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    DeviceInfoModule.getDeviceName().then(setDeviceName);
    DeviceInfoModule.getSystemVersion().then(setSystemVersion);
    DeviceInfoModule.getAppVersion().then(setAppVersion);
  }, []);

  const [deviceName, setDeviceName] = useState('');
  const [systemVersion, setSystemVersion] = useState('');
  const [appVersion, setAppVersion] = useState('');

  //Change language
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  //Delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.delete_account_title'),
      t('settings.delete_account_message'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.delete_account_confirm'),
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await deleteAllExpensesForUser(user.uid);
              await AsyncStorage.removeItem(`user_${user.email}`);
              setExpenses([]);
              await signOut();
            } catch (e) {
              Alert.alert('Error', 'Could not delete account');
            }
          },
        },
      ]
    );
  };

  //Notification toggle
  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      const granted = await NotificationModule.requestPermission();
      if (granted) {
        NotificationModule.showNotification(
          t('notifications.title'),
          t('notifications.enabled')
        );
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>{t('settings.title')}</Text>

      {/*Select language*/}
      <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
      <View style={styles.card}>
        {LANGUAGES.map((lang, index) => (
          <View key={lang.code}>
            <SettingsRow
              label={lang.label}
              onPress={() => handleLanguageChange(lang.code)}
              right={
                i18n.language === lang.code ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null
              }
            />
            {index < LANGUAGES.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/*Notification and Biometric Toggles*/}
      <Text style={styles.sectionTitle}>Features</Text>
      <View style={styles.card}>
        <SettingsRow
          label={t('settings.notifications')}
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ true: '#34C759' }}
              thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
            />
          }
        />
        <View style={styles.divider} />

        {/*Device information*/}
        <View style={styles.card}>
          <SettingsRow label="Device" value={deviceName} />
          <View style={styles.divider} />
          <SettingsRow label="iOS" value={systemVersion} />
          <View style={styles.divider} />
          <SettingsRow label="App version" value={appVersion} />
        </View>
      </View>

      {/*Account section*/}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        {user?.email ? (
          <>
            <SettingsRow label={user.email} />
            <View style={styles.divider} />
          </>
        ) : null}
        <SettingsRow
          label={t('settings.sign_out')}
          onPress={signOut}
        />
        <View style={styles.divider} />
        <SettingsRow
          label={t('settings.delete_account')}
          onPress={handleDeleteAccount}
          destructive
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
    paddingTop: 56,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 52,
  },
  rowLabel: {
    fontSize: 16,
    color: '#000',
  },
  destructive: {
    color: '#FF3B30',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
  checkmark: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
});