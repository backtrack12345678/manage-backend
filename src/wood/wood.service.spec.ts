import { Test, TestingModule } from '@nestjs/testing';
import { WoodService } from './wood.service';

describe('WoodService', () => {
  let service: WoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoodService],
    }).compile();

    service = module.get<WoodService>(WoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
