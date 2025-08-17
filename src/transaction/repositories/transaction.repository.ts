import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';
import { IGetTransactionsOtherOptions } from '../interfaces/transaction.interface';

@Injectable()
export class TransactionRepository {
  constructor(private prismaService: PrismaService) {}

  async createTransaction<T extends Prisma.TransactionSelect>(
    data: Prisma.TransactionUncheckedCreateInput,
    selectOptions?: T,
    prismaClient: Prisma.TransactionClient | PrismaService = this.prismaService,
  ): Promise<Prisma.TransactionGetPayload<{ select: T }>> {
    return prismaClient.transaction.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getTransactions<T extends Prisma.TransactionSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.TransactionWhereInput,
    otherOptions?: IGetTransactionsOtherOptions,
    prismaClient: Prisma.TransactionClient | PrismaService = this.prismaService,
  ): Promise<Prisma.TransactionGetPayload<{ select: T }>[]> {
    return prismaClient.transaction.findMany({
      where: whereOptions,
      select: selectOptions || undefined,
      ...otherOptions,
    });
  }

  async getTransactionById<T extends Prisma.TransactionSelect>(
    id: string,
    selectOptions?: T,
  ): Promise<Prisma.TransactionGetPayload<{ select: T }>> {
    return this.prismaService.transaction.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async updateTransactionById<T extends Prisma.TransactionSelect>(
    id: string,
    data: Prisma.TransactionUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.TransactionGetPayload<{ select: T }>> {
    return this.prismaService.transaction.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async deleteTransactionById<T extends Prisma.TransactionSelect>(
    id: string,
    selectOptions?: T,
  ): Promise<Prisma.TransactionGetPayload<{ select: T }>> {
    return this.prismaService.transaction.delete({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }
}
