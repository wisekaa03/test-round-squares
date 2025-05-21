import { ApiProperty } from '@nestjs/swagger';

import { Token } from '../../interfaces/token';
import { User } from './user.response';

export class AuthenticationPayload {
  @ApiProperty({ description: 'Тип: Bearer', example: 'bearer' })
  type!: 'bearer';

  @ApiProperty({
    description: 'Токен, используемый в Authorization: Bearer',
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
