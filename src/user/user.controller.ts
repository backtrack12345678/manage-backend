import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../../generated/prisma';
import { IUserResponse } from './interfaces/user.interface';
import { IWebResponse } from '../common/interfaces/web.interface';
import { IAuth } from '../auth/interfaces/auth.interface';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<IWebResponse<IUserResponse>> {
    const result = await this.userService.create(payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pengguna Berhasil Dibuat',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(): Promise<IWebResponse<IUserResponse[]>> {
    const result = await this.userService.findAll();
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Get('profile')
  async findProfile(@Req() request: any): Promise<IWebResponse<IUserResponse>> {
    const auth: IAuth = request.user;
    const result = await this.userService.findProfile(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IWebResponse<IUserResponse>> {
    const result = await this.userService.findOne(id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Req() request: any,
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<IWebResponse<IUserResponse>> {
    const auth: IAuth = request.user;
    const result = await this.userService.update(auth, id, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pengguna Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(
    @Req() request: any,
    @Param('id') id: string,
  ): Promise<IWebResponse<boolean>> {
    const auth: IAuth = request.user;
    await this.userService.remove(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pengguna Berhasil DiHapus',
      data: true,
    };
  }
}
