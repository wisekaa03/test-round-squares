import { Module, Global } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './auth.controller';
import { ServicesModule } from '../services/services.module';
import { TapController } from './tap.controller';
import { RoundController } from './round.controller';

@Global()
@Module({
  imports: [DatabaseModule, AuthModule, ServicesModule],
  controllers: [AuthController, TapController, RoundController],
})
export class ControllersModule {}
