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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { signIn, isLoading, errorMessage, clearError } = useAuthStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  //Clear error message when the component mounts or when the user navigates to this screen, to dont show the error
  //al the time
  useEffect(() => {
    clearError();
  }, [clearError]);

  const isDisabled = email.trim() === '' || password.trim() === '' || isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/*Header*/}
        <View style={styles.header}>
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>💰</Text>
          </View>
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
        </View>

        {/*Form*/}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t('login.email')}
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
            placeholder={t('login.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            placeholderTextColor="#8E8E93"
          />

          {/*Error message */}
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          {/*Login button*/}
          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={() => signIn(email, password)}
            disabled={isDisabled}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('login.button')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/*Link to Sign Up*/}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('login.no_account')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>{t('login.signup_link')}</Text>
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
  footerText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  link: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
});