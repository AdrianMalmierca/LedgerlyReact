import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      set({ errorMessage: 'No existe cuenta con ese email. Regístrate primero.', isLoading: false });
      return;
    }
    const { passwordHash } = JSON.parse(stored);
    if (passwordHash !== password) {
      set({ errorMessage: 'Contraseña incorrecta', isLoading: false });
      return;
    }
    set({ user: { uid: email, email }, isLoading: false });
  },

  signUp: async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      set({ errorMessage: 'Las contraseñas no coinciden' });
      return;
    }
    set({ isLoading: true, errorMessage: null });
    await AsyncStorage.setItem(`user_${email}`, JSON.stringify({ passwordHash: password }));
    set({ user: { uid: email, email }, isLoading: false });
  },

  signOut: async () => {
    set({ user: null });
  },

  clearError: () => set({ errorMessage: null }),
}));