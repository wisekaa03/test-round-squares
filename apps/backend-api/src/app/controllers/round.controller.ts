import { Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Round, RoundWinner } from '@api/dto';
import { RoundService } from '@api/services/round.service';
import { ApiComplex, Roles } from '@api/decorators';
import { JwtAuthGuard, RolesGuard } from '@api/guards';

@ApiComplex({ path: ['round'], roles: ['*'] })
export class RoundController {
  private readonly logger = new Logger(RoundController.name);

  constructor(private readonly roundService: RoundService) {}

  @Get()
  @ApiOperation({
    operationId: 'round-get',
    summary: 'Раунды The Last of Guss',
  })
  @ApiResponse({
    description: 'Успешный ответ',
    type: RoundWinner,
    isArray: true,
  })
  async getRound(): Promise<RoundWinner[]> {
    return this.roundService.find();
  }

  @Post()
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    operationId: 'round-start',
    summary: 'Начало нового раунда The Last of Guss',
  })
  @ApiResponse({
    description: 'Успешный ответ',
    type: Round,
  })
  async startRound(): Promise<Round> {
    return this.roundService.start();
  }
}
