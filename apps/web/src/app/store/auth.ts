import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: '',
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: '' }),
}));
