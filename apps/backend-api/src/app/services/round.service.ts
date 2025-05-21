import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, type DeepPartial } from 'typeorm';
import dayjs from 'dayjs';
import { RoundEntity } from '@/database/round.entity';
import { ConfigService } from '@nestjs/config';
import { RoundViewEntity } from '@/database/round.view';

@Injectable()
export class RoundService {
  private logger = new Logger(RoundService.name);

  private readonly ROUND_DURATION = this.configService.get<number>('ROUND_DURATION') * 1000;
  private readonly COOLDOWN_DURATION = this.configService.get<number>('COOLDOWN_DURATION') * 1000;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(RoundEntity)
    public readonly roundRepository: Repository<RoundEntity>,
    @InjectRepository(RoundViewEntity)
    public readonly roundViewRepository: Repository<RoundViewEntity>,
  ) {}

  async findOne(options: FindOneOptions<RoundEntity>) {
    return this.roundRepository.findOne(options);
  }

  async findById(id: string) {
    return this.roundRepository.findOneBy({
      id,
    });
  }

  async find() {
    return this.roundViewRepository.find();
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
