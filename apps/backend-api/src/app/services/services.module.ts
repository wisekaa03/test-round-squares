import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '@api/database/database.module';
import { AuthModule } from '@api/auth/auth.module';
import { UserService } from './user.service';
import { RoundService } from './round.service';
import { TapService } from './tap.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  providers: [UserService, TapService, RoundService],
  exports: [UserService, TapService, RoundService],
})
export class ServicesModule {}
