import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { UserEntity } from './user.entity';
import { RoundEntity } from './round.entity';
import { TapEntity } from './tap.entity';
import { TypeOrmOptionsClass } from './database.options';
import { RoundViewEntity } from './round.view';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptionsClass,
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([UserEntity, RoundEntity, TapEntity, RoundViewEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async onModuleInit() {
    await this.entityManager.query('SET TIME ZONE "Europe/Moscow"');
    await this.entityManager.query('SET TIMEZONE TO "Europe/Moscow"');
  }
}
