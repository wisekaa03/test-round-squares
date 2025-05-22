import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ServicesModule } from '@api/services/services.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_ACCESS_TOKEN'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ServicesModule,
  ],

  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
