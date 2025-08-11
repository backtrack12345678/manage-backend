import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async createUser<T extends Prisma.UserSelect>(
    data: Prisma.UserCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.UserGetPayload<{ select: T }>> {
    return this.prismaService.user.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getUserByUsername<T extends Prisma.UserSelect>(
    username: string,
    selectOptions?: T,
  ): Promise<Prisma.UserGetPayload<{ select: T }>> {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
      select: selectOptions || undefined,
    });
  }

  async getUserById<T extends Prisma.UserSelect>(
    id: string,
    selectOptions?: T,
  ): Promise<Prisma.UserGetPayload<{ select: T }>> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async getUsers<T extends Prisma.UserSelect>(
    selectOptions?: T,
  ): Promise<Prisma.UserGetPayload<{ select: T }>[]> {
    return this.prismaService.user.findMany({
      select: selectOptions || undefined,
    });
  }

  async deleteUserById<T extends Prisma.UserSelect>(
    id: string,
    selectOptions?: T,
  ): Promise<Prisma.UserGetPayload<{ select: T }>> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
        refreshToken: {
          delete: { userId: id },
        },
      },
      select: selectOptions || undefined,
    });
  }

  async updateUserById<T extends Prisma.UserSelect>(
    id: string,
    data: Prisma.UserUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.UserGetPayload<{ select: T }>> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async countUserByUsername(username: string): Promise<number> {
    return this.prismaService.user.count({
      where: {
        username,
      },
    });
  }
}
