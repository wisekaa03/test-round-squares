import { ApiProperty } from '@nestjs/swagger';

import { Token } from '@api/interfaces/token';
import { User } from './user.response';

export class AuthenticationPayload {
  @ApiProperty({ description: 'Тип: Bearer', type: 'string', example: 'bearer' })
  type!: 'bearer';

  @ApiProperty({
    description: 'Токен, используемый в Authorization: Bearer',
    type: 'string',
    example: 'eyJcbGciOcJIUcI1xxxxxxxxxxxxxxxx',
  })
  token!: Token;
}

export class AuthResponse {
  @ApiProperty({
    description: 'Возвращаемый токен',
    type: AuthenticationPayload,
    required: true,
  })
  payload!: AuthenticationPayload;

  @ApiProperty({
    description: 'Пользователь',
    type: User,
    required: true,
  })
  data!: User;
}
