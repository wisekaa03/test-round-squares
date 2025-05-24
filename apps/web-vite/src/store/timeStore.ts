import { makeAutoObservable } from 'mobx';
import dayjs from '../dayjs-setup';

class TimeStore {
  now: dayjs.Dayjs = dayjs();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    makeAutoObservable(this);
    this.intervalId = setInterval(() => {
      this.now = dayjs(); // обновляем каждую секунду
    }, 1000);
  }

  clear() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const timeStore = new TimeStore();
