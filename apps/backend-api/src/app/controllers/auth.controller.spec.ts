import { Test, TestingModule } from '@nestjs/testing';
import { GUARDS_METADATA } from '@nestjs/common/constants';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';
import { AuthController } from './auth.controller';

export const mockRepository = jest.fn(() => ({
  findOne: async () => Promise.resolve([]),
  findAndCount: async () => Promise.resolve([]),
  save: async () => Promise.resolve([]),
  create: () => [],
  remove: async () => Promise.resolve([]),
  get: (key: string, defaultValue?: string) => defaultValue,
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe(AuthController.name, () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: UserService, useClass: mockRepository },
        { provide: AuthService, useClass: mockRepository },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should ensure the JwtAuthGuard is applied to the AuthController.authorization', async () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, AuthController.prototype.authorization);
    const guard = new guards[0]();

    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });
});
