import { makeAutoObservable } from 'mobx';
import dayjs from '../dayjs-setup';

class TimeStore {
  now = dayjs();

  constructor() {
    makeAutoObservable(this);
    setInterval(() => {
      this.now = dayjs(); // обновляем каждую секунду
    }, 1000);
  }
}

export const timeStore = new TimeStore();
