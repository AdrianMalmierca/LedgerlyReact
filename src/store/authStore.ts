import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

interface AuthState {
  user: { uid: string; email: string } | null;
  isLoading: boolean;
  errorMessage: string | null;

  setUser: (user: { uid: string; email: string } | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, confirmPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  errorMessage: null,

  setUser: (user) => set({ user }),

  signIn: async (email, password) => {
    set({ isLoading: true, errorMessage: null });
    const stored = await AsyncStorage.getItem(`user_${email}`);
    if (!stored) {
      set({ errorMessage: i18n.t('auth.no_account'), isLoading: false });
      return;
    }
    const { passwordHash } = JSON.parse(stored);
    if (passwordHash !== password) {
      set({ errorMessage: i18n.t('auth.wrong_password'), isLoading: false });
      return;
    }
    set({ user: { uid: email, email }, isLoading: false });
  },

  signUp: async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      set({ errorMessage: i18n.t('auth.passwords_no_match') });
      return;
    }
    set({ isLoading: true, errorMessage: null });
    
    const existing = await AsyncStorage.getItem(`user_${email}`);
    if (existing) {
      set({ errorMessage: i18n.t('auth.email_already_exists'), isLoading: false });
      return;
    }

    await AsyncStorage.setItem(`user_${email}`, JSON.stringify({ passwordHash: password }));
    set({ user: { uid: email, email }, isLoading: false });
  },

  signOut: async () => {
    set({ user: null });
  },

  clearError: () => set({ errorMessage: null }),
}));