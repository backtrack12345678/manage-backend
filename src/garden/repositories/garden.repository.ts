import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class GardenRepository {
  constructor(private prismaService: PrismaService) {}

  async createGarden<T extends Prisma.GardenSelect>(
    data: Prisma.GardenCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.GardenGetPayload<{ select: T }>> {
    return this.prismaService.garden.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getGardens<T extends Prisma.GardenSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.GardenWhereInput,
  ): Promise<Prisma.GardenGetPayload<{ select: T }>[]> {
    return this.prismaService.garden.findMany({
      where: whereOptions,
      select: selectOptions || undefined,
    });
  }

  async getGardenById<T extends Prisma.GardenSelect>(
    id: number,
    selectOptions?: T,
  ): Promise<Prisma.GardenGetPayload<{ select: T }>> {
    return this.prismaService.garden.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async updateGardenById<T extends Prisma.GardenSelect>(
    id: number,
    data: Prisma.GardenUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.GardenGetPayload<{ select: T }>> {
    return this.prismaService.garden.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async countGardenById(id: number): Promise<number> {
    return this.prismaService.garden.count({
      where: {
        id,
      },
    });
  }

  async getTotalQuantityByGardenId(id: number): Promise<number> {
    const totalQuantity = await this.prismaService.gardenWood.aggregate({
      where: {
        gardenId: id,
      },
      _sum: {
        quantity: true,
      },
    });

    return totalQuantity._sum.quantity;
  }

  async getTotalQuantityByGardenIds(ids: number[]) {
    const whereCondition = ids.length > 0 ? { gardenId: { in: ids } } : {};

    const result = await this.prismaService.gardenWood.groupBy({
      by: ['gardenId'],
      where: whereCondition,
      _sum: {
        quantity: true,
      },
    });

    return result.map((item) => ({
      gardenId: item.gardenId,
      totalQuantity: item._sum.quantity || 0,
    }));
  }

  async getGardenWoodByIds<T extends Prisma.GardenWoodSelect>(
    gardenId: number,
    woodId: number,
    selectOptions?: T,
  ): Promise<Prisma.GardenWoodGetPayload<{ select: T }>> {
    return this.prismaService.gardenWood.findFirst({
      where: {
        gardenId,
        woodId,
      },
      select: selectOptions || undefined,
    });
  }

  async decrementQuantity(
    gardenId: number,
    woodId: number,
    qty: number,
    prismaClient: Prisma.TransactionClient | PrismaService = this.prismaService,
  ): Promise<{ quantity: number }> {
    return prismaClient.gardenWood.update({
      where: {
        gardenId_woodId: { gardenId, woodId },
      },
      data: {
        quantity: {
          decrement: qty,
        },
      },
      select: {
        quantity: true,
      },
    });
  }
}
