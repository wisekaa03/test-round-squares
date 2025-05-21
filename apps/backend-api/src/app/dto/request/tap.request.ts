import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class TapRequest {
  @ApiProperty({
    description: 'Раунд ID',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  @IsUUID('all')
  roundId!: string;
}
