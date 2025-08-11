import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UserRole } from '../../generated/prisma';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { StatusResponse } from '../common/enums/web.enum';
import { IWebResponse } from '../common/interfaces/web.interface';
import { IVehicleResponse } from './interfaces/vehicle.interface';
import { IAuth } from '../auth/interfaces/auth.interface';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Auth()
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() payload: CreateVehicleDto,
  ): Promise<IWebResponse<IVehicleResponse>> {
    const result = await this.vehicleService.create(payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kendaraan Berhasil Di Tambahkan',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(
    @Req() request: any,
  ): Promise<IWebResponse<IVehicleResponse[]>> {
    const auth: IAuth = request.user;
    const result = await this.vehicleService.findAll(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IWebResponse<IVehicleResponse>> {
    const auth: IAuth = request.user;
    const result = await this.vehicleService.findOne(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateVehicleDto,
  ): Promise<IWebResponse<IVehicleResponse>> {
    const result = await this.vehicleService.update(id, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kendaraan Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IWebResponse<boolean>> {
    await this.vehicleService.remove(id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kendaraan Berhasil Dihapus',
      data: true,
    };
  }
}
