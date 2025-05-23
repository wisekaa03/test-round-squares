import { Body, Get, Logger, ParseUUIDPipe, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { ApiComplex } from '@api/decorators';
import { TapRequest, TapResponse } from '@api/dto';
import { TapService } from '@api/services/tap.service';

@ApiComplex({ path: ['tap'], roles: ['*'] })
export class TapController {
  private readonly logger = new Logger(TapController.name);

  constructor(private readonly tapService: TapService) {}

  @Get()
  @ApiOperation({ operationId: 'getTap', summary: 'Получить тапы' })
  @ApiResponse({ description: 'Успешный ответ', type: TapResponse })
  async getTap(
    @Req() { user }: FastifyRequest,
    @Query('roundId', ParseUUIDPipe) roundId: string,
  ): Promise<TapResponse> {
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.tapService.getTap(user, roundId);
  }

  @Post()
  @ApiOperation({
    operationId: 'tap',
    summary: 'Тапаем',
  })
  @ApiResponse({
    description: 'Успешный ответ',
    type: TapResponse,
  })
  async tap(@Req() { user }: FastifyRequest, @Body() update: TapRequest): Promise<TapResponse> {
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.tapService.tap(user, update);
  }
}
