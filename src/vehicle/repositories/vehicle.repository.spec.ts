import { Test, TestingModule } from '@nestjs/testing';
import { VehicleRepository } from './vehicle.repository';

describe('VehicleRepository', () => {
  let provider: VehicleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleRepository],
    }).compile();

    provider = module.get<VehicleRepository>(VehicleRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
