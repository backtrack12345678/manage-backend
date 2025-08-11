import { Test, TestingModule } from '@nestjs/testing';
import { WoodController } from './wood.controller';
import { WoodService } from './wood.service';

describe('WoodController', () => {
  let controller: WoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WoodController],
      providers: [WoodService],
    }).compile();

    controller = module.get<WoodController>(WoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
