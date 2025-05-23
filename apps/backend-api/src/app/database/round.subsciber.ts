import dayjs from 'dayjs';
import 'dayjs/plugin/utc';
import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { RoundViewEntity } from './round.view';

dayjs.extend(require('dayjs/plugin/utc'));

@EventSubscriber()
export class RoundSubscriber implements EntitySubscriberInterface<RoundViewEntity> {
  private readonly COOLDOWN_DURATION = this.configService.get<number>('COOLDOWN_DURATION', 30) * 1000;

  constructor(
    private readonly configService: ConfigService,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return RoundViewEntity;
  }

  entity(entity: RoundViewEntity) {
    const dateNow = dayjs().utc(false).toDate();
    const dateCooldownNow = dayjs().utc(false).subtract(this.COOLDOWN_DURATION).toDate();
    if (entity.startTime > dateCooldownNow) {
      entity.status = 'Cooldown';
    } else if (entity.endTime >= dateNow && entity.startTime <= dateNow) {
      entity.status = 'Активный';
    } else {
      entity.status = 'Завершенный';
    }
  }

  afterLoad(entity: RoundViewEntity) {
    this.entity(entity);
  }
}
