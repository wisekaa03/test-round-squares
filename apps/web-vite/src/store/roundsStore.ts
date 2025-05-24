import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import dayjs from '../dayjs-setup';
import { RoundWinner } from '../api/Api';
import { swaggerApi } from '../api/api-instance';
import { authStore } from './authStore';

class RoundStore {
  rounds: RoundWinner[] = [];
  loading = false;
  errorRounds: string | null = null;
  errorStart: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async start() {
    this.errorStart = null;
    try {
      await swaggerApi.api.roundStart(authStore.getAuthorization());
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        runInAction(() => {
          this.errorStart = error.response?.data?.message ?? 'Не удалось стартовать новый раунд';
        });
      }
    }
  }

  async fetch() {
    this.loading = true;
    this.errorRounds = null;

    try {
      const { data } = await swaggerApi.api.roundGet(authStore.getAuthorization());
      runInAction(() => {
        this.rounds = (data as RoundWinner[]).map((round) => ({
          ...round,
          startTime: dayjs(round.startTime).format('DD.MM.YYYY HH:mm:ss'),
          endTime: dayjs(round.endTime).format('DD.MM.YYYY HH:mm:ss'),
        }));
        this.loading = false;
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        runInAction(() => {
          this.errorRounds = error.response?.data?.message ?? 'Не удалось получить список раундов';
          this.loading = false;
        });
      }
    }
  }
}

export const roundsStore = new RoundStore();
