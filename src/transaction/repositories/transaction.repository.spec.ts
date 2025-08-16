import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
  let provider: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionRepository],
    }).compile();

    provider = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
