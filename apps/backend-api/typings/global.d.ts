import { UserEntity } from '../src/app/database/user.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserEntity;
  }
}
