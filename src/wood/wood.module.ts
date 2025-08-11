import { Module } from '@nestjs/common';
import { WoodService } from './wood.service';
import { WoodController } from './wood.controller';
import { WoodRepository } from './repositories/wood.repository';

@Module({
  controllers: [WoodController],
  providers: [WoodService, WoodRepository],
  exports: [WoodService],
})
export class WoodModule {}
