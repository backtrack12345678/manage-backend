import { Test, TestingModule } from '@nestjs/testing';
import { WoodRepository } from './wood.repository';

describe('WoodRepository', () => {
  let provider: WoodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoodRepository],
    }).compile();

    provider = module.get<WoodRepository>(WoodRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
