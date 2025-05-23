import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { TapResponse } from '../api/Api';
import { swaggerApi } from '../api/api-instance';
import { authStore } from './auth';

class GussStore {
  guss: TapResponse = { tap: 0, score: 0, roundScore: 0 };

  loading = false;
  errorGet: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getTap(roundId: string) {
    this.loading = true;
    this.errorGet = null;

    try {
      const { data } = await swaggerApi.api.getTap({ roundId }, authStore.getAuthorization());
      runInAction(() => {
        if (dayjs(data.startTime).isBefore()) {
          setTimeout(() => this.getTap(roundId), dayjs(data.startTime).diff());
        }
        this.guss = data;
        this.loading = false;
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        runInAction(() => {
          this.errorGet = error.response?.data?.message ?? 'Не удалось получить очки';
          this.loading = false;
        });
      }
    }
  }

  async tap(roundId: string) {
    this.loading = true;
    this.errorGet = null;

    try {
      const { data } = await swaggerApi.api.tap({ roundId }, authStore.getAuthorization());
      runInAction(() => {
        this.guss = data;
        this.loading = false;
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        runInAction(() => {
          this.errorGet = error.response?.data?.message ?? 'Не удалось получить очки';
          this.loading = false;
        });
      }
    }
  }
}

export const gussStore = new GussStore();
