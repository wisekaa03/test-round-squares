import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import type { RoundSquaresJwtPayload } from '../interfaces/jwt.payload';
import { UserService } from '../services/user.service';
import { AuthService } from './auth.service';
import { UserEntity } from '../database/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    const secretOrKey = authService.secretAccessToken;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: RoundSquaresJwtPayload): Promise<UserEntity> {
    return this.userService.findById(payload.sub);
  }
}
