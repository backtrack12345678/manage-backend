import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserRole } from '../../generated/prisma';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { IWebResponse } from '../common/interfaces/web.interface';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import { ICustomerResponse } from '../customer/interfaces/customer.interface';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Auth()
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() payload: CreateCustomerDto,
  ): Promise<IWebResponse<ICustomerResponse>> {
    const result = await this.customerService.create(payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pemilik Berhasil Di Tambahkan',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(
    @Req() request: any,
  ): Promise<IWebResponse<ICustomerResponse[]>> {
    const auth: IAuth = request.user;
    const result = await this.customerService.findAll(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IWebResponse<ICustomerResponse>> {
    const auth: IAuth = request.user;
    const result = await this.customerService.findOne(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ): Promise<IWebResponse<ICustomerResponse>> {
    const result = await this.customerService.update(id, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pemilik Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IWebResponse<boolean>> {
    await this.customerService.remove(id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pemilik Berhasil Dihapus',
      data: true,
    };
  }
}
