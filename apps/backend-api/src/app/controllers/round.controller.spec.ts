import { Test, TestingModule } from '@nestjs/testing';
import { RoundController } from './round.controller';
import { RoundService } from '@api/services/round.service';

describe('RoundController', () => {
  let controller: RoundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoundController],
      providers: [RoundService],
    })
      .overrideProvider(RoundService)
      .useValue({
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        start: jest.fn(),
      })
      .compile();

    controller = module.get<RoundController>(RoundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
