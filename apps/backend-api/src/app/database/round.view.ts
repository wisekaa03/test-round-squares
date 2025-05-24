import { ApiProperty } from '@nestjs/swagger';
import { DataSource, SelectQueryBuilder, ViewColumn, ViewEntity } from 'typeorm';

import { RoundEntity } from './round.entity';
import { TapEntity } from './tap.entity';
import { UserEntity } from './user.entity';
import { StatusLog } from '@api/enums/statoslog.enum';

@ViewEntity({
  name: 'roundWinner',
  materialized: false,
  expression: (connection: DataSource) =>
    connection
      .createQueryBuilder()
      .select('r."id"', 'id')
      .addSelect('r."startTime"', 'startTime')
      .addSelect('r."endTime"', 'endTime')
      .addSelect('r."score"', 'roundScore')
      .addSelect('r."createdAt"', 'createdAt')
      .addSelect('r."updatedAt"', 'updatedAt')
      .addSelect('t."id"', 'tapId')
      .addSelect('t."score"', 'tapScore')
      .addSelect('t."userId"', 'winnerUserId')
      .addSelect('u."name"', 'winnerUserName')
      .from(RoundEntity, 'r')
      .leftJoin(
        (qb: SelectQueryBuilder<TapEntity>) =>
          qb
            .distinctOn(['tap.roundId'])
            .select('*')
            .from(TapEntity, 'tap')
            .orderBy('tap.roundId', 'ASC')
            .addOrderBy('tap.score', 'DESC'),
        't',
        't."roundId" = r."id"',
      )
      .leftJoin(UserEntity, 'u', 'u."id" = t."userId"'),
})
export class RoundViewEntity {
  @ViewColumn()
  @ApiProperty({
    description: 'Идентификатор раунда',
    format: 'uuid',
    required: true,
  })
  id!: string;

  @ViewColumn()
  @ApiProperty({
    description: 'Время начала',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  startTime!: Date;

  @ViewColumn()
  @ApiProperty({
    description: 'Время начала',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  endTime!: Date;

  @ViewColumn()
  @ApiProperty({
    description: 'Время создания',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  createdAt!: Date;

  @ViewColumn()
  @ApiProperty({
    description: 'Время изменения',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  updatedAt!: Date;

  @ViewColumn()
  @ApiProperty({
    description: 'Идентификатор победителя',
    format: 'uuid',
    required: true,
  })
  winnerUserId!: string;

  @ViewColumn()
  @ApiProperty({
    description: 'Имя победителя',
    format: 'string',
    example: 'nikita',
    required: true,
  })
  winnerUserName!: string;

  @ViewColumn()
  @ApiProperty({
    description: 'Сколько тапнул',
    required: true,
  })
  tapId!: string;

  @ViewColumn()
  @ApiProperty({
    description: 'Сколько очков',
    required: true,
  })
  tapScore!: number;

  @ViewColumn()
  @ApiProperty({
    description: 'Сколько очков в раунде',
    required: true,
  })
  roundScore!: number;

  @ApiProperty({
    description: 'Статус раунда',
    enum: StatusLog,
    enumName: 'StatusLog',
    required: true,
  })
  status!: StatusLog;
}
