import { ApiProperty } from '@nestjs/swagger';

import { Status } from '@api/enums/status.enum';

export class SuccessResponse {
  @ApiProperty({
    description: 'Статус операции',
    enum: Status,
    enumName: 'Status',
    example: Status.Success,
  })
  status!: Status.Success;
}
