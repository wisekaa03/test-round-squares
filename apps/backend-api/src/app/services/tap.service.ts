import dayjs from 'dayjs';
import 'dayjs/plugin/utc';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { TapRequest, TapResponse } from '@api/dto';
import { TapEntity } from '@api/database/tap.entity';
import { UserEntity } from '@api/database/user.entity';
import { RoundEntity } from '@api/database/round.entity';
import { RoundService } from './round.service';

dayjs.extend(require('dayjs/plugin/utc'));

@Injectable()
export class TapService {
  private logger = new Logger(TapService.name);

  private readonly ROUND_DURATION = this.configService.get<number>('ROUND_DURATION', 60) * 1000;
  private readonly COOLDOWN_DURATION = this.configService.get<number>('COOLDOWN_DURATION', 30) * 1000;

  constructor(
    private readonly configService: ConfigService,
    public readonly roundService: RoundService,
    @InjectRepository(TapEntity)
    public readonly tapRepository: Repository<TapEntity>,
  ) {}

  async findOne(options: FindOneOptions<TapEntity>) {
    return this.tapRepository.findOne(options);
  }

  async findById(id: string) {
    return this.tapRepository.findOneBy({
      id,
    });
  }

  /**
   * Получаем статистику по тапам
   * @param {UserEntity} user - Пользователь
   * @returns {TapResponse} - Ответ на запрос
   */
  async getTap(user: UserEntity, roundId: string): Promise<TapResponse> {
    const tapEntity = await this.tapRepository.findOne({
      where: { roundId, userId: user.id },
      select: { id: true, tap: true, score: true, round: { id: true, score: true } },
    });
    const roundEntity = await this.roundService.findById(roundId);

    return {
      tap: tapEntity?.tap || 0,
      score: tapEntity?.score || 0,
      roundScore: roundEntity?.roundScore || 0,
      winnerUserName: roundEntity?.winnerUserName,
      status: roundEntity?.status,
      startTime: roundEntity?.startTime.toISOString(),
      endTime: roundEntity?.endTime.toISOString(),
    };
  }

  /**
   * Тапаем
   * @async
   * @param {UserEntity} user - Пользователь
   * @param {TapRequest} update - Запрос на тап
   * @returns {TapResponse} - Ответ на запрос
   */
  async tap(user: UserEntity, update: TapRequest): Promise<TapResponse> {
    const nikita = user.role === 'nikita';
    const dateNow = dayjs().utc(false).toDate();

    const tapEntity = await this.tapRepository.manager.transaction(async (trans) => {
      const roundFind = await trans.findOne(RoundEntity, {
        where: {
          id: update.roundId,
          startTime: LessThanOrEqual(dateNow),
          endTime: MoreThanOrEqual(dateNow),
        },
      });
      if (!roundFind) {
        throw new NotFoundException('Раунд не найден или уже закончился или не начался');
      }
      const tapFind = await trans.findOne(TapEntity, {
        where: {
          roundId: update.roundId,
          userId: user.id,
        },
        relations: { round: true },
        select: { id: true, tap: true },
      });

      // Если тапнул не никита, то добавляем 1 к тапу
      if (nikita) {
        if (!tapFind) {
          await trans.insert(TapEntity, { roundId: update.roundId, userId: user.id, tap: 0, score: 0 });
        }
      } else {
        let score = 1;
        if (tapFind && !(tapFind.tap % 11)) {
          score = 10;
        }

        if (tapFind) {
          await trans.update(TapEntity, { id: tapFind.id }, { tap: () => `tap + 1`, score: () => `score + ${score}` });
        } else {
          await trans.insert(TapEntity, { roundId: update.roundId, userId: user.id, tap: 1, score });
        }
        await trans.update(RoundEntity, update.roundId, { score: () => `score + ${score}` });
      }

      return trans.findOne(TapEntity, {
        where: { roundId: update.roundId, userId: user.id },
        select: { id: true, tap: true, score: true, round: { id: true, score: true } },
      });
    });
    const roundEntity = await this.roundService.findById(update.roundId);

    return {
      tap: tapEntity?.tap || 0,
      score: tapEntity?.score || 0,
      roundScore: roundEntity?.roundScore || 0,
      winnerUserName: roundEntity?.winnerUserName,
      status: roundEntity?.status,
      startTime: roundEntity?.startTime.toISOString(),
      endTime: roundEntity?.endTime.toISOString(),
    };
  }
}
