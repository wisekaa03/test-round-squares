import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import dayjs from '@api/interfaces/dayjs-setup';
import { RoundViewEntity } from './round.view';
import { StatusLog } from '@api/enums/statoslog.enum';

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
    const dateCooldownNow = dayjs(entity.startTime).subtract(this.COOLDOWN_DURATION);
    const startTime = dayjs(entity.startTime);
    const endTime = dayjs(entity.endTime);
    const now = dayjs();
    const beforeStart = startTime.isBefore(now);
    const afterEnd = endTime.isAfter(now);
    if (beforeStart && afterEnd) {
      entity.status = StatusLog.Active;
    } else if (dateCooldownNow.isBefore(now) && afterEnd) {
      entity.status = StatusLog.Cooldown;
    } else {
      entity.status = StatusLog.Finished;
    }
  }

  afterLoad(entity: RoundViewEntity) {
    this.entity(entity);
  }
}
