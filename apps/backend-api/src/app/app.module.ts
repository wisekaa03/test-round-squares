import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config.options';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ControllersModule } from './controllers/controllers.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ConfigModule.forRoot(configOptions), DatabaseModule, ServicesModule, AuthModule, ControllersModule],
})
export class AppModule {}
