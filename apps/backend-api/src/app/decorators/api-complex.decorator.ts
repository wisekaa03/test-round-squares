import {
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from '../guards';

export const ApiComplex = ({ path, roles }: { path: string[]; roles?: string[] }) =>
  Array.isArray(roles)
    ? applyDecorators(
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Ответ будет таким если с данным что-то не так',
          type: BadRequestException,
        }),
        ApiResponse({
          status: HttpStatus.CONFLICT,
          description: 'Ответ для конфликта файлов',
          type: ConflictException,
        }),
        ApiResponse({
          status: HttpStatus.FORBIDDEN,
          description: 'Ответ для неавторизованного пользователя',
          type: ForbiddenException,
        }),
        ApiResponse({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'Ошибка сервера',
          type: InternalServerErrorException,
        }),
        ApiResponse({
          status: HttpStatus.NOT_ACCEPTABLE,
          description: 'Не принято значение',
          type: NotAcceptableException,
        }),
        ApiResponse({
          status: HttpStatus.NOT_FOUND,
          description: 'Не найдено',
          type: NotFoundException,
        }),
        ApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          description: 'Ответ для незарегистрированного пользователя',
          type: UnauthorizedException,
        }),
        UseGuards(JwtAuthGuard, RolesGuard),
        ApiBearerAuth(),
        ApiTags(...path),
        Controller(path),
      )
    : applyDecorators(
        ApiResponse({
          status: HttpStatus.BAD_REQUEST,
          description: 'Ответ будет таким если с данным что-то не так',
          type: BadRequestException,
        }),
        ApiResponse({
          status: HttpStatus.CONFLICT,
          description: 'Ответ для конфликта файлов',
          type: ConflictException,
        }),
        ApiResponse({
          status: HttpStatus.FORBIDDEN,
          description: 'Ответ для неавторизованного пользователя',
          type: ForbiddenException,
        }),
        ApiResponse({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          description: 'Ошибка сервера',
          type: InternalServerErrorException,
        }),
        ApiResponse({
          status: HttpStatus.NOT_ACCEPTABLE,
          description: 'Не принято значение',
          type: NotAcceptableException,
        }),
        ApiResponse({
          status: HttpStatus.NOT_FOUND,
          description: 'Не найдено',
          type: NotFoundException,
        }),
        ApiResponse({
          status: HttpStatus.UNAUTHORIZED,
          description: 'Ответ для незарегистрированного пользователя',
          type: UnauthorizedException,
        }),
        ApiTags(...path),
        Controller(path),
      );
