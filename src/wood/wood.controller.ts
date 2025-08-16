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
  HttpCode,
} from '@nestjs/common';
import { WoodService } from './wood.service';
import { CreateWoodDto } from './dto/create-wood.dto';
import { UpdateWoodDto } from './dto/update-wood.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../../generated/prisma';
import { IWebResponse } from '../common/interfaces/web.interface';
import { IWoodResponse } from './interfaces/wood.interface';
import { IAuth } from '../auth/interfaces/auth.interface';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('wood')
export class WoodController {
  constructor(private readonly woodService: WoodService) {}

  @Auth()
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  @Post()
  async create(
    @Body() payload: CreateWoodDto,
  ): Promise<IWebResponse<IWoodResponse>> {
    const result = await this.woodService.create(payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kayu Berhasil Di Tambahkan',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(@Req() request: any): Promise<IWebResponse<IWoodResponse[]>> {
    const auth: IAuth = request.user;
    const result = await this.woodService.findAll(auth);
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
  ): Promise<IWebResponse<IWoodResponse>> {
    const auth: IAuth = request.user;
    const result = await this.woodService.findOne(auth, id);
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
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateWoodDto,
  ): Promise<IWebResponse<IWoodResponse>> {
    const auth: IAuth = request.user;
    const result = await this.woodService.update(auth, id, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kayu Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IWebResponse<boolean>> {
    await this.woodService.remove(id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kayu Berhasil Dihapus',
      data: true,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Get(':woodId/logs')
  async logs(
    @Param('woodId', ParseIntPipe) woodId: number,
  ): Promise<IWebResponse<IWoodResponse>> {
    const result = await this.woodService.logs(woodId);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }
}
