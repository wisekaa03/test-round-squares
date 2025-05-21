import { Test, TestingModule } from '@nestjs/testing';
import { TapController } from './tap.controller';

describe('TapController', () => {
  let controller: TapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TapController],
    }).compile();

    controller = module.get<TapController>(TapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
