import { create } from 'zustand';

interface AuthState {
  token: string | null;
  name: string | null;
  id: string | null;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  name: null,
  id: null,
}));

export const setToken = (token: string) => useAuthStore.setState({ token });
export const getToken = () => useAuthStore.getState()['token'];
export const clearToken = () => useAuthStore.setState({ token: null });

export const setUserName = (name: string) => useAuthStore.setState({ name });
export const getUserName = () => useAuthStore.getState()['name'];

export const setUserId = (id: string) => useAuthStore.setState({ id });
export const getUserId = () => useAuthStore.getState()['id'];
