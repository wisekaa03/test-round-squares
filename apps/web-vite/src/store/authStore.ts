import { AxiosRequestConfig } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { AuthResponse, User } from '../api/Api';

class AuthStore {
  isLoggedIn = false;
  accessToken: string | null = null;
  rememberMe = true;
  isAdmin = false;
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
    this.restoreSession();
  }

  getAuthorization(): AxiosRequestConfig {
    return { headers: { Authorization: `Bearer ${authStore.accessToken}` } };
  }

  login(data: AuthResponse) {
    this.user = data.data;
    this.accessToken = data.payload.token;
    this.isLoggedIn = true;
    this.isAdmin = data.data.role === 'admin';
    if (this.rememberMe) {
      localStorage.setItem('accessToken', data.payload.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  setRememberMe(checked: boolean) {
    this.rememberMe = checked;
    localStorage.setItem('rememberMe', `${this.rememberMe}`);
  }

  restoreSession() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      runInAction(() => {
        this.accessToken = token;
        this.isLoggedIn = true;
      });
    }
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      try {
        const user = JSON.parse(userJSON);
        runInAction(() => {
          this.user = user;
          this.isAdmin = user.role === 'admin';
        });
      } catch (error: unknown) {
        console.log(error);
      }
    }
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
      runInAction(() => {
        this.rememberMe = true;
      });
    }
  }
}

export const authStore = new AuthStore();
