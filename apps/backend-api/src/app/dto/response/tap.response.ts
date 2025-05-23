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
  })
  winnerUserName!: string;
}
