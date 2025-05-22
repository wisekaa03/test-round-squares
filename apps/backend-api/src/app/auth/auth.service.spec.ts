import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';
import { UserEntity } from '../database/user.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

AuthService.validateCredentials = () => true;

describe(AuthService.name, () => {
  let service: AuthService;
  let userService: UserService;

  const name = 'Admin';
  const password = 'Secret~123456';
  const token = 'token';

  const user: UserEntity = {
    id: '1',
    name,
    role: 'admin',
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = jest.fn(() => ({
    find: async () => Promise.resolve([]),
    findById: async () => Promise.resolve({ ...user, password }),
    findOne: async () => Promise.resolve(user),
    signAsync: async () => Promise.resolve(token),
    create: (value: any) => value,
    insert: async () => Promise.resolve([]),
    update: async () => Promise.resolve([]),
    delete: async () => Promise.resolve([]),
    verify: () => true,
    get: (key: string, defaultValue?: string) => defaultValue,
    getOrThrow: (key: string, defaultValue?: string) => defaultValue,
    t: (value: unknown) => value,
    emit: async (event: string, data: unknown) => new Observable((s) => s.next(data)),
    send: async (id: unknown) => new Observable((s) => s.next(id)),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useClass: mockRepository },
        { provide: JwtService, useClass: mockRepository },
        { provide: JwtStrategy, useClass: mockRepository },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: mockRepository,
        },
        AuthService,
        UserService,
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('login', async () => {
    const login = await service.login(name, password);
    expect(login).toBeDefined();
  });
});
