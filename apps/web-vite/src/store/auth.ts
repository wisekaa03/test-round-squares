import { AuthResponse, User } from '@web/api/Api';
import { makeAutoObservable, runInAction } from 'mobx';

class AuthStore {
  isLoggedIn = false;
  accessToken: string | null = null;
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
    this.restoreSession();
  }

  login(data: AuthResponse) {
    this.user = data.data;
    this.accessToken = data.payload.token;
    this.isLoggedIn = true;
    localStorage.setItem('accessToken', data.payload.token);
  }

  logout() {
    this.isLoggedIn = false;
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem('accessToken');
  }

  restoreSession() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      runInAction(() => {
        this.accessToken = token;
        this.isLoggedIn = true;
      });
    }
  }
}

export const authStore = new AuthStore();
