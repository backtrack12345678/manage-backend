import { Injectable } from '@nestjs/common';
import { CreateWoodDto } from './dto/create-wood.dto';
import { UpdateWoodDto } from './dto/update-wood.dto';
import { WoodRepository } from './repositories/wood.repository';
import { ErrorService } from '../common/error/error.service';
import { Prisma, UserRole } from '../../generated/prisma';
import {
  IWoodLogsResult,
  IWoodResponse,
  IWoodResult,
} from './interfaces/wood.interface';
import { IAuth } from '../auth/interfaces/auth.interface';

@Injectable()
export class WoodService {
  constructor(
    private errorService: ErrorService,
    private woodRepository: WoodRepository,
  ) {}

  async create(payload: CreateWoodDto): Promise<IWoodResponse> {
    const { price, ...woodData } = payload;
    const wood = await this.woodRepository.createWood(
      {
        price: Prisma.Decimal(price),
        ...woodData,
      },
      this.woodSelectOptions,
    );

    return this.toWoodResponse(wood);
  }

  async findAll(auth: IAuth) {
    const whereOptions = auth.role !== UserRole.ADMIN ? { isActive: true } : {};
    const woods = await this.woodRepository.getWoods(
      this.woodSelectOptions,
      whereOptions,
    );
    return woods.map((wood) => this.toWoodResponse(wood));
  }

  async findOne(auth: IAuth, id: number): Promise<IWoodResponse> {
    const wood = await this.woodRepository.getWoodById(
      id,
      this.woodSelectOptions,
    );

    if (!wood || (auth.role !== UserRole.ADMIN && !wood.isActive))
      this.errorService.notFound('Kayu Tidak Ditemukan');

    return this.toWoodResponse(wood);
  }

  async update(
    auth: IAuth,
    id: number,
    payload: UpdateWoodDto,
  ): Promise<IWoodResponse> {
    const wood = await this.woodRepository.getWoodById(
      id,
      this.woodSelectOptions,
    );

    if (!wood) this.errorService.notFound('Kayu Tidak Ditemukan');

    const updatedWood = await this.woodRepository.updateWoodById(
      id,
      {
        ...payload,
        ...(payload.price && {
          priceLogs: {
            create: {
              oldName: wood.name,
              oldUnit: wood.unit,
              newPrice: Prisma.Decimal(payload.price),
              oldPrice: wood.price,
              updatedById: auth.id,
            },
          },
        }),
      },
      this.woodSelectOptions,
    );

    return this.toWoodResponse(updatedWood);
  }

  async remove(id: number): Promise<void> {
    const wood = await this.woodRepository.countWoodById(id);

    if (wood === 0) this.errorService.notFound('Kayu Tidak Ditemukan');

    await this.woodRepository.updateWoodById(
      id,
      {
        isActive: false,
      },
      {
        id: true,
      },
    );
  }

  async logs(woodId: number) {
    const wood = await this.woodRepository.getWoodById(woodId, {
      ...this.woodSelectOptions,
      priceLogs: {
        select: this.woodLogsSelectOptions,
      },
    });

    if (!wood) this.errorService.notFound('Kayu Tidak Ditemukan');

    return this.toWoodResponse(wood);
  }

  public toWoodResponse(wood: IWoodResult): IWoodResponse {
    const { price, priceLogs, ...woodResult } = wood;
    return {
      ...woodResult,
      price: price.toString(),
      logs: priceLogs?.map((priceLog) => this.toWoodLogsResponse(priceLog)),
    };
  }

  private toWoodLogsResponse(woodLogs: IWoodLogsResult) {
    const { oldPrice, newPrice, ...woodResult } = woodLogs;
    return {
      ...woodResult,
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString(),
    };
  }

  public woodSelectOptions = {
    id: true,
    name: true,
    price: true,
    unit: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  private woodLogsSelectOptions = {
    id: true,
    oldName: true,
    oldUnit: true,
    newPrice: true,
    oldPrice: true,
    updatedBy: {
      select: {
        id: true,
        name: true,
      },
    },
    updatedAt: true,
  };

  public async validateWoodsbyIds(ids: number[]) {
    const woods = await this.woodRepository.getWoodsByIds(ids, {
      id: true,
    });

    if (woods.length === 0) {
      this.errorService.notFound('Kayu Tidak Ditemukan');
    }

    const existingWoodIds = woods.map((wood) => wood.id);
    const notFoundWoodIds = ids.filter(
      (woodId) => !existingWoodIds.includes(woodId),
    );

    if (notFoundWoodIds.length > 0) {
      this.errorService.notFound(
        `Kayu Dengan ID Berikut Tidak Ditemukan: ${notFoundWoodIds.join(', ')}`,
      );
    }
  }
}
