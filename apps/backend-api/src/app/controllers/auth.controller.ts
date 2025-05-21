import { Body, Get, Logger, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/dto';
import { ApiComplex } from '@/decorators/api-complex.decorator';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';
import { FastifyRequest } from 'fastify';

@ApiComplex({ path: ['auth'] })
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'auth-get',
    summary: 'Проверяет, авторизован ли пользователь и выдает о пользователе полную информацию',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: User,
  })
  async authorization(@Req() { user }: FastifyRequest): Promise<User> {
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return user;
  }

  @Post('login')
  @ApiOperation({
    operationId: 'auth-login',
    summary: 'Авторизация пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: AuthResponse,
  })
  async login(@Body() { name, password }: LoginRequest): Promise<AuthResponse> {
    const [data, payload] = await this.authService.login(name, password);

    return {
      payload,
      data,
    };
  }

  @Post('register')
  @ApiOperation({
    operationId: 'auth-register',
    summary: 'Регистрация пользователя',
  })
  @ApiResponse({
    status: 201,
    description: 'Успешный ответ',
    type: AuthResponse,
  })
  async register(@Body() body: RegisterRequest): Promise<AuthResponse> {
    const user = await this.userService.register(body);
    const token = await this.authService.generateAccessToken(user);
    const payload = this.authService.buildResponsePayload(token);

    return {
      payload,
      data: user,
    };
  }
}
