import { Body, Logger, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { ApiComplex } from '@/decorators';
import { TapRequest, TapResponse } from '@/dto';
import { TapService } from '@/services/tap.service';

@ApiComplex({ path: ['tap'], roles: ['*'] })
export class TapController {
  private readonly logger = new Logger(TapController.name);

  constructor(private readonly tapService: TapService) {}

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
    return this.tapService.tap(user, update);
  }
}
