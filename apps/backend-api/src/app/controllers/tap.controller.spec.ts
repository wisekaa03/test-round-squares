import { Test, TestingModule } from '@nestjs/testing';
import { TapController } from './tap.controller';
import { TapService } from '@api/services/tap.service';

describe('TapController', () => {
  let controller: TapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TapController],
      providers: [TapService],
    })
      .overrideProvider(TapService)
      .useValue({
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        tap: jest.fn(),
      })
      .compile();

    controller = module.get<TapController>(TapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
