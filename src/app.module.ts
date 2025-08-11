import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WoodModule } from './wood/wood.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { CustomerModule } from './customer/customer.module';
import { GardenModule } from './garden/garden.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, WoodModule, VehicleModule, CustomerModule, GardenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
