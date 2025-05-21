import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

import { UserEntity } from '../../database/user.entity';

export class LoginRequest extends PickType(UserEntity, ['name', 'password']) {
  @ApiProperty({
    example: 'Secret~12345678',
    description: 'Пароля пользователя (должен удовлетворять минимальным требованиям)',
    minLength: 8,
    maxLength: 30,
    type: 'string',
    format: 'password',
    pattern: '/((?=.*\\d)|(?=.*\\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password!: string;
}
