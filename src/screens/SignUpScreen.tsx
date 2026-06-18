import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { signUp, isLoading, errorMessage, clearError } = useAuthStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  useFocusEffect(
    React.useCallback(() => {
      clearError();
    }, [clearError])
  );

  const isDisabled =
    email.trim() === '' ||
    password.trim() === '' ||
    confirmPassword.trim() === '' ||
    isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/*Header*/}
        <View style={styles.header}>
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>₴</Text>
          </View>
          <Text style={styles.title}>{t('signup.title')}</Text>
          <Text style={styles.subtitle}>{t('signup.subtitle')}</Text>
        </View>

        {/*Form*/}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t('signup.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            placeholderTextColor="#8E8E93"
          />

          <TextInput
            style={styles.input}
            placeholder={t('signup.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
            placeholderTextColor="#8E8E93"
          />

          <TextInput
            style={styles.input}
            placeholder={t('signup.confirm_password')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            textContentType="newPassword"
            placeholderTextColor="#8E8E93"
          />

          {/*Error message */}
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          {/*Sign Up button*/}
          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={() => signUp(email, password, confirmPassword)}
            disabled={isDisabled}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('signup.button')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/*Back to login*/}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>← {t('login.button')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    gap: 8,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  form: {
    paddingHorizontal: 24,
    gap: 12,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  error: {
    fontSize: 13,
    color: '#FF3B30',
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  link: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
});