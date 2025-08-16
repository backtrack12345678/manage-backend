import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { GardenService } from './garden.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { UserRole } from '../../generated/prisma';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { StatusResponse } from '../common/enums/web.enum';
import {
  IGardenReportResponse,
  IGardenResponse,
} from './interfaces/garden.interface';
import { IWebResponse } from '../common/interfaces/web.interface';
import { IAuth } from '../auth/interfaces/auth.interface';
import { GetReportQueryDto } from './dto/get-garden.dto';

@Controller('garden')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @Auth()
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  @Post()
  async create(
    @Body() payload: CreateGardenDto,
  ): Promise<IWebResponse<IGardenResponse>> {
    const result = await this.gardenService.create(payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kebun Berhasil Di Tambahkan',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(@Req() request: any): Promise<IWebResponse<IGardenResponse[]>> {
    const auth: IAuth = request.user;
    const result = await this.gardenService.findAll(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Get('report')
  async report(
    @Query() query: GetReportQueryDto,
  ): Promise<IWebResponse<IGardenReportResponse[]>> {
    const result = await this.gardenService.report(query);
    return {
      status: StatusResponse.SUCCESS,
      message: `Laporan Kebun ${query.month}`,
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IWebResponse<IGardenResponse>> {
    const auth: IAuth = request.user;
    const result = await this.gardenService.findOne(auth, id);
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
    @Body() payload: UpdateGardenDto,
  ): Promise<IWebResponse<IGardenResponse>> {
    const result = await this.gardenService.update(id, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kebun Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IWebResponse<boolean>> {
    await this.gardenService.remove(id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kebun Berhasil Dihapus',
      data: true,
    };
  }
}
