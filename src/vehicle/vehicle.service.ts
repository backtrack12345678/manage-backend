import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleRepository } from './repositories/vehicle.repository';
import { ErrorService } from '../common/error/error.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { UserRole } from '../../generated/prisma';
import {
  IVehicleReportResponse,
  IVehicleResponse,
} from './interfaces/vehicle.interface';
import { PrismaService } from '../common/prisma/prisma.service';
import { GetReportQueryDto } from './dto/get-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    private vehicleRepository: VehicleRepository,
    private errorService: ErrorService,
    private prismaService: PrismaService,
  ) {}

  async create(payload: CreateVehicleDto): Promise<IVehicleResponse> {
    const vehicle = await this.vehicleRepository.createVehicle(
      payload,
      this.vehicleSelectOptions,
    );

    return vehicle;
  }

  async findAll(auth: IAuth): Promise<IVehicleResponse[]> {
    const whereOptions = auth.role !== UserRole.ADMIN ? { isActive: true } : {};
    const vehicles = await this.vehicleRepository.getVehicles(
      this.vehicleSelectOptions,
      whereOptions,
    );

    return vehicles;
  }

  async findOne(auth: IAuth, id: number): Promise<IVehicleResponse> {
    const vehicle = await this.vehicleRepository.getVehicleById(
      id,
      this.vehicleSelectOptions,
    );

    if (!vehicle || (auth.role !== UserRole.ADMIN && !vehicle.isActive))
      this.errorService.notFound('Kendaraan Tidak Ditemukan');

    return vehicle;
  }

  async findOneWithoutAuth(id: number) {
    const vehicle = await this.vehicleRepository.getVehicleById(
      id,
      this.vehicleSelectOptions,
    );

    if (!vehicle || !vehicle.isActive)
      this.errorService.notFound('Kendaraan Tidak Ditemukan');

    return vehicle;
  }

  async update(
    id: number,
    payload: UpdateVehicleDto,
  ): Promise<IVehicleResponse> {
    const countVehicle = await this.vehicleRepository.countVehicleById(id);

    if (countVehicle === 0)
      await this.errorService.notFound('Kendaraan Tidak Ditemukan');

    const vehicle = await this.vehicleRepository.updateVehicleById(
      id,
      payload,
      this.vehicleSelectOptions,
    );

    return vehicle;
  }

  async remove(id: number): Promise<void> {
    const countVehicle = await this.vehicleRepository.countVehicleById(id);

    if (countVehicle === 0)
      await this.errorService.notFound('Kendaraan Tidak Ditemukan');

    await this.vehicleRepository.updateVehicleById(
      id,
      {
        isActive: false,
      },
      {
        id: true,
      },
    );
  }

  async report(query?: GetReportQueryDto): Promise<IVehicleReportResponse[]> {
    const { startDate, endDate } = this.getMonthDateRange(query.month);

    const vehicles = await this.prismaService.transaction.groupBy({
      by: ['vehicleName'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        vehicleName: 'asc',
      },
    });

    return vehicles.map((vehicle) => ({
      name: vehicle.vehicleName,
      total: vehicle._count.id,
    }));
  }

  private vehicleSelectOptions = {
    id: true,
    name: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  private getMonthDateRange(month: string) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    return { startDate, endDate };
  }
}
