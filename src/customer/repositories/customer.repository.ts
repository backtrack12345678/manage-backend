import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class CustomerRepository {
  constructor(private prismaService: PrismaService) {}

  async createCustomer<T extends Prisma.CustomerSelect>(
    data: Prisma.CustomerCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.CustomerGetPayload<{ select: T }>> {
    return this.prismaService.customer.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getCustomers<T extends Prisma.CustomerSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.CustomerWhereInput,
  ): Promise<Prisma.CustomerGetPayload<{ select: T }>[]> {
    return this.prismaService.customer.findMany({
      where: whereOptions,
      select: selectOptions || undefined,
    });
  }

  async getCustomerById<T extends Prisma.CustomerSelect>(
    id: number,
    selectOptions?: T,
  ): Promise<Prisma.CustomerGetPayload<{ select: T }>> {
    return this.prismaService.customer.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async updateCustomerById<T extends Prisma.CustomerSelect>(
    id: number,
    data: Prisma.CustomerUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.CustomerGetPayload<{ select: T }>> {
    return this.prismaService.customer.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async countCustomerById(id: number): Promise<number> {
    return this.prismaService.customer.count({
      where: {
        id,
      },
    });
  }
}
