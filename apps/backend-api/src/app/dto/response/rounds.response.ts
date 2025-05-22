import { ApiProperty } from '@nestjs/swagger';

import { RoundViewEntity } from '@api/database/round.view';

export class RoundWinner extends RoundViewEntity {}

export class Rounds {
  @ApiProperty({
    description: 'Список раундов',
    type: RoundWinner,
    isArray: true,
    required: true,
  })
  data!: RoundWinner[];
}
