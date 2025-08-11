import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class VehicleRepository {
  constructor(private prismaService: PrismaService) {}

  async createVehicle<T extends Prisma.VehicleSelect>(
    data: Prisma.VehicleCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.VehicleGetPayload<{ select: T }>> {
    return this.prismaService.vehicle.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getVehicles<T extends Prisma.VehicleSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.VehicleWhereInput,
  ): Promise<Prisma.VehicleGetPayload<{ select: T }>[]> {
    return this.prismaService.vehicle.findMany({
      where: whereOptions,
      select: selectOptions || undefined,
    });
  }

  async getVehicleById<T extends Prisma.VehicleSelect>(
    id: number,
    selectOptions?: T,
  ): Promise<Prisma.VehicleGetPayload<{ select: T }>> {
    return this.prismaService.vehicle.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async updateVehicleById<T extends Prisma.VehicleSelect>(
    id: number,
    data: Prisma.VehicleUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.VehicleGetPayload<{ select: T }>> {
    return this.prismaService.vehicle.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async countVehicleById(id: number): Promise<number> {
    return this.prismaService.vehicle.count({
      where: {
        id,
      },
    });
  }
}
