import dayjs from 'dayjs';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TapEntity } from '@/database/tap.entity';
import { TapRequest, TapResponse } from '@/dto';
import { UserEntity } from '@/database/user.entity';
import { RoundEntity } from '@/database/round.entity';
import 'dayjs/plugin/utc';

dayjs.extend(require('dayjs/plugin/utc'));

@Injectable()
export class TapService {
  private logger = new Logger(TapService.name);

  private readonly ROUND_DURATION = this.configService.get<number>('ROUND_DURATION', 60) * 1000;
  private readonly COOLDOWN_DURATION = this.configService.get<number>('COOLDOWN_DURATION', 30) * 1000;

  constructor(
    private readonly configService: ConfigService,
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
        relations: { round: true },
        select: { id: true, tap: true, score: true, round: { id: true, score: true } },
      });
    });
    if (!tapEntity) {
      throw new InternalServerErrorException('Тап не найден');
    }

    return { tap: tapEntity.tap, score: tapEntity.score, roundScore: tapEntity.round?.score || 0 };
  }
}
