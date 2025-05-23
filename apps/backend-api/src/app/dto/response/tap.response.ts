import { ApiProperty } from '@nestjs/swagger';

export class TapResponse {
  @ApiProperty({
    description: 'Количество тапов',
    type: 'number',
    example: 1,
  })
  tap!: number;

  @ApiProperty({
    description: 'Очки за раунд',
    type: 'number',
    example: 1,
  })
  score!: number;

  @ApiProperty({
    description: 'Общие очки за раунд',
    type: 'number',
    example: 1,
  })
  roundScore!: number;

  @ApiProperty({
    description: 'Победитель в раунде',
    type: 'string',
    example: 'John',
    required: false,
  })
  winnerUserName?: string;

  @ApiProperty({
    description: 'Статус',
    type: 'string',
    example: 'Активный / Завершен / Cooldown',
    required: false,
  })
  status?: string;

  @ApiProperty({
    description: 'Время создания',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  startTime?: string;

  @ApiProperty({
    description: 'Время окончания',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  endTime?: string;
}
