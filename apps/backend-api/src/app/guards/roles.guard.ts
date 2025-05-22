import type { FastifyRequest } from 'fastify';
import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '@api/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const executionClass = context.getClass();
    const executionHanlder = context.getHandler();

    const requiredRoles = this.reflector.getAllAndOverride(Roles, [executionHanlder, executionClass]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<FastifyRequest>();
    const { role: userRole } = user ?? {};

    return !userRole ? false : requiredRoles.some((role) => userRole === role);
  }
}
