import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { TapResponse } from '../api/Api';
import { swaggerApi } from '../api/api-instance';
import { authStore } from './authStore';

class GussStore {
  guss: TapResponse | null = null;
  errorGet: string | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getTap(roundId: string) {
    this.errorGet = null;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    try {
      const { data } = await swaggerApi.api.getTap({ roundId }, authStore.getAuthorization());

      runInAction(() => {
        this.guss = data;
      });

      const now = dayjs();
      const start = dayjs(data.startTime);
      const end = dayjs(data.endTime);

      if (start.isAfter(now) || end.isAfter(now)) {
        const delay = start.diff(now) < 0 ? end.diff(now) : start.diff(now);

        this.timeoutId = setTimeout(() => this.getTap(roundId), delay);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        runInAction(() => {
          this.errorGet = error.response?.data?.message ?? 'Не удалось получить очки';
        });
      }
    }
  }

  async tap(roundId: string) {
    this.errorGet = null;

    try {
      const { data } = await swaggerApi.api.tap({ roundId }, authStore.getAuthorization());
      runInAction(() => {
        this.guss = data;
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        runInAction(() => {
          this.errorGet = error.response?.data?.message ?? 'Не удалось получить очки';
        });
      }
    }
  }

  clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export const gussStore = new GussStore();
