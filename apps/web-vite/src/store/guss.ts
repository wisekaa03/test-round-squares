import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { TapResponse } from '../api/Api';
import { swaggerApi } from '../api/api-instance';
import { authStore } from './auth';

class GussStore {
  guss: TapResponse = { tap: 0, score: 0, roundScore: 0 };

  startTime: dayjs.Dayjs | null = null;
  endTime: dayjs.Dayjs | null = null;
  startInterval: NodeJS.Timeout | null = null;
  endInterval: NodeJS.Timeout | null = null;

  loading = false;
  errorGet: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  times() {
    if (this.startTime) {
      if (this.startInterval) {
        clearInterval(this.startInterval);
      }
      this.startInterval = setInterval(() => {
        this.startTime?.subtract(1, 'second');
      }, 1000);
    }
    if (this.endTime) {
      if (this.endInterval) {
        clearInterval(this.endInterval);
      }
      this.endInterval = setInterval(() => {
        this.endTime?.subtract(1, 'second');
      }, 1000);
    }
  }

  async getTap(roundId: string) {
    this.loading = true;
    this.errorGet = null;

    try {
      const { data } = await swaggerApi.api.getTap({ roundId }, authStore.getAuthorization());
      runInAction(() => {
        this.guss = data;
        this.startTime = dayjs(data.startTime);
        this.endTime = dayjs(data.endTime);
        this.times();
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
        this.startTime = dayjs(data.startTime);
        this.endTime = dayjs(data.endTime);
        this.times();
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
