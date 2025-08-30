import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { GardenModule } from '../garden/garden.module';
import { CustomerModule } from '../customer/customer.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { WoodModule } from '../wood/wood.module';

@Module({
  imports: [GardenModule, CustomerModule, VehicleModule, WoodModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionRepository],
})
export class TransactionModule {}
