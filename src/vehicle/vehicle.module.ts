import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { VehicleRepository } from './repositories/vehicle.repository';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, VehicleRepository],
  exports: [VehicleService],
})
export class VehicleModule {}
