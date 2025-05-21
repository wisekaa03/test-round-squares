import { createHmac } from 'crypto';
import { slugify } from 'transliteration';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, type DeepPartial } from 'typeorm';
import { UserEntity } from '../database/user.entity';
import { RegisterRequest } from '../dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options: FindOneOptions<UserEntity>) {
    return this.userRepository.findOne(options);
  }

  async findById(id: string) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  /**
   * Заводит нового пользователя
   * @async
   * @param {RegisterRequest} create
   * @returns {UserEntity} Пользователь
   */
  async register(create: RegisterRequest): Promise<UserEntity> {
    const { name, password } = create;
    if (!name) {
      throw new BadRequestException('Не указано имя');
    }
    if (!password) {
      throw new BadRequestException('Не указан пароль');
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        name,
      },
    });
    if (existingUser) {
      throw new BadRequestException('Указанное имя уже занято');
    }

    const userPartial: DeepPartial<UserEntity> = {
      name,
      role: slugify(name, { lowercase: true, trim: true }),
      password: createHmac('sha256', password.normalize()).digest('hex'),
    };

    const { password: _, ...user } = await this.userRepository.save(this.userRepository.create(userPartial));
    return user;
  }
}
