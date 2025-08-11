import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { IUserResponse } from './interfaces/user.interface';
import { UserRole } from '../../generated/prisma/';
import { IAuth } from '../auth/interfaces/auth.interface';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private userRepository: UserRepository,
    private errorService: ErrorService,
  ) {}

  async create(payload: CreateUserDto): Promise<IUserResponse> {
    if (await this.isUsernameExists(payload.username)) {
      this.errorService.badRequest('Username Telah Digunakan');
    }

    const { password, ...userData } = payload;
    const id = `user-${uuid().toString()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.createUser(
      {
        id,
        password: hashedPassword,
        ...userData,
      },
      this.selectUserOptions,
    );

    return user;
  }

  async findAll(): Promise<IUserResponse[]> {
    const users = await this.userRepository.getUsers(this.selectUserOptions);

    return users;
  }

  async findProfile(auth: IAuth): Promise<IUserResponse> {
    const user = await this.userRepository.getUserById(
      auth.id,
      this.selectUserOptions,
    );

    if (!user) {
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    return user;
  }

  async findOne(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.getUserById(
      id,
      this.selectUserOptions,
    );

    if (!user) {
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    return user;
  }

  async update(
    auth: IAuth,
    id: string,
    payload: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userRepository.getUserById(
      id,
      this.selectUserOptions,
    );

    if (!user) {
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    if (user.role === UserRole.ADMIN) {
      this.errorService.forbidden(`Tidak Dapat Memperbarui ${UserRole.ADMIN}`);
    }

    if (payload.username && payload.username !== user.username) {
      if (await this.isUsernameExists(payload.username)) {
        this.errorService.badRequest('Username Telah Digunakan');
      }
    }

    const { password, ...userData } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await this.userRepository.updateUserById(
      id,
      {
        ...userData,
        password: hashedPassword,
      },
      this.selectUserOptions,
    );

    return updatedUser;
  }

  async remove(auth: IAuth, id: string): Promise<void> {
    const user = await this.userRepository.getUserById(id, {
      ...this.selectUserOptions,
      refreshToken: {
        select: {
          userId: true,
        },
      },
    });

    if (!user) {
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    if (user.role === UserRole.ADMIN) {
      this.errorService.forbidden(`Tidak Dapat Menghapus ${UserRole.ADMIN}`);
    }

    //soft delete
    await this.userRepository.updateUserById(
      id,
      {
        isActive: false,
        ...(user.refreshToken?.userId && {
          refreshToken: {
            delete: true,
          },
        }),
      },
      {
        id: true,
      },
    );
  }

  private selectUserOptions = {
    id: true,
    username: true,
    name: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async isUsernameExists(username: string): Promise<boolean> {
    const countUsername: number =
      await this.userRepository.countUserByUsername(username);

    if (countUsername === 0) {
      return false;
    }

    return true;
  }
}
