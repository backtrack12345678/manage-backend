import { Module } from '@nestjs/common';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';
import { GardenRepository } from './repositories/garden.repository';
import { WoodModule } from '../wood/wood.module';

@Module({
  imports: [WoodModule],
  controllers: [GardenController],
  providers: [GardenService, GardenRepository],
  exports: [GardenRepository, GardenService],
})
export class GardenModule {}
