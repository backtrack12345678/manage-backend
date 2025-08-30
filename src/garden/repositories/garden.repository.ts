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

  async decrementQuantity(
    id: number,
    qty: number,
    prismaClient: Prisma.TransactionClient | PrismaService = this.prismaService,
  ) {
    return prismaClient.garden.update({
      where: {
        id,
      },
      data: {
        woodPiecesQtyActual: {
          decrement: qty,
        },
      },
      select: {
        woodPiecesQtyActual: true,
      },
    });
  }
}
