import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '@api/database/user.entity';

export class User extends OmitType(UserEntity, ['password']) {}
