import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

import { UserEntity } from '../../database/user.entity';

export class RegisterRequest extends PartialType(PickType(UserEntity, ['name'])) {
  @ApiProperty({
    example: 'Secret~12345678',
    description: 'Пароля пользователя (должен удовлетворять минимальным требованиям)',
    minLength: 8,
    maxLength: 32,
    pattern: '/((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
  })
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  @IsDefined()
  @IsNotEmpty()
  password!: string;
}
