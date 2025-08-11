import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class WoodRepository {
  constructor(private prismaService: PrismaService) {}

  async createWood<T extends Prisma.WoodSelect>(
    data: Prisma.WoodCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.WoodGetPayload<{ select: T }>> {
    return this.prismaService.wood.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getWoods<T extends Prisma.WoodSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.WoodWhereInput,
  ): Promise<Prisma.WoodGetPayload<{ select: T }>[]> {
    return this.prismaService.wood.findMany({
      where: whereOptions,
      select: selectOptions || undefined,
    });
  }

  async getWoodById<T extends Prisma.WoodSelect>(
    id: number,
    selectOptions?: T,
  ): Promise<Prisma.WoodGetPayload<{ select: T }>> {
    return this.prismaService.wood.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async getWoodsByIds<T extends Prisma.WoodSelect>(
    ids: number[],
    selectOptions?: T,
  ): Promise<Prisma.WoodGetPayload<{ select: T }>[]> {
    return this.prismaService.wood.findMany({
      where: { id: { in: ids }, isActive: true },
      select: selectOptions || undefined,
    });
  }

  async updateWoodById<T extends Prisma.WoodSelect>(
    id: number,
    data: Prisma.WoodUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.WoodGetPayload<{ select: T }>> {
    return this.prismaService.wood.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async countWoodById(id: number): Promise<number> {
    return this.prismaService.wood.count({
      where: {
        id,
      },
    });
  }
}
