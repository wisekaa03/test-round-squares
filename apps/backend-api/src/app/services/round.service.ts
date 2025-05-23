import { FindOneOptions, Repository, type DeepPartial } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

import { RoundEntity } from '@api/database/round.entity';
import { RoundViewEntity } from '@api/database/round.view';

@Injectable()
export class RoundService {
  private logger = new Logger(RoundService.name);

  private readonly ROUND_DURATION = this.configService.get<number>('ROUND_DURATION', 60) * 1000;
  private readonly COOLDOWN_DURATION = this.configService.get<number>('COOLDOWN_DURATION', 30) * 1000;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(RoundEntity)
    public readonly roundRepository: Repository<RoundEntity>,
    @InjectRepository(RoundViewEntity)
    public readonly roundViewRepository: Repository<RoundViewEntity>,
  ) {}

  async findOne(options: FindOneOptions<RoundViewEntity>) {
    return this.roundViewRepository.findOne(options);
  }

  async findById(id: string) {
    return this.roundViewRepository.findOneBy({
      id,
    });
  }

  async find() {
    return this.roundViewRepository.find({ order: { startTime: 'DESC' } });
  }

  async start() {
    const dateNow = dayjs();

    const roundPartial: DeepPartial<RoundEntity> = this.roundRepository.create({
      startTime: dateNow.add(this.COOLDOWN_DURATION).toDate(),
      endTime: dateNow.add(this.COOLDOWN_DURATION + this.ROUND_DURATION).toDate(),
      score: 0,
    });

    return this.roundRepository.save(roundPartial);
  }
}
