import { createHmac } from 'crypto';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type JwtSignOptions, JwtService } from '@nestjs/jwt';

import { JWT_BASE_OPTIONS, type RoundSquaresJwtPayload } from '../interfaces/jwt.payload';
import { AuthenticationPayload } from '../dto';
import { UserService } from '../services/user.service';
import { UserEntity } from '../database/user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  public accessTokenExpires = this.configService.getOrThrow('JWT_ACCESS_EXPIRES');
  public secretAccessToken = this.configService.getOrThrow('JWT_ACCESS_TOKEN');

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(name: string, password: string): Promise<[UserEntity, AuthenticationPayload]> {
    if (!name || !password) {
      throw new ForbiddenException('Неверный логин или пароль');
    }

    let userFind = await this.userService.findOne({
      where: { name },
      select: ['id', 'name', 'password', 'role'],
    });
    if (!userFind) {
      userFind = await this.userService.register({ name, password });
    }
    const { password: passwordToCheck, ...user } = userFind;

    const valid = AuthService.validateCredentials(passwordToCheck ?? '', password);
    if (!valid) {
      throw new ForbiddenException('Неверный логин или пароль');
    }

    const token = await this.generateAccessToken(user);
    const payload = this.buildResponsePayload(token);

    return [user, payload];
  }

  buildResponsePayload(token: string): AuthenticationPayload {
    return {
      type: 'bearer',
      token,
    };
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    const opts: JwtSignOptions = {
      ...JWT_BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: this.accessTokenExpires,
    };

    return this.jwtService.signAsync({ name: user.name, role: user.role }, opts);
  }

  async jwtVerify(token: string): Promise<RoundSquaresJwtPayload> {
    return this.jwtService.verifyAsync(token, {
      ...JWT_BASE_OPTIONS,
    });
  }

  static validateCredentials = (passwordToCheck: string, password: string): boolean => {
    const passwordSha256 = createHmac('sha256', password.normalize()).digest('hex');
    return passwordSha256 === passwordToCheck;
  };
}
