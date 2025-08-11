import { Test, TestingModule } from '@nestjs/testing';
import { GardenRepository } from './garden.repository';

describe('GardenRepository', () => {
  let provider: GardenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GardenRepository],
    }).compile();

    provider = module.get<GardenRepository>(GardenRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
