import { Injectable } from '@nestjs/common';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { GardenRepository } from './repositories/garden.repository';
import { ErrorService } from '../common/error/error.service';
import { WoodService } from '../wood/wood.service';
import { IGardenResponse, IGardenResult } from './interfaces/garden.interface';
import { IAuth } from '../auth/interfaces/auth.interface';
import { UserRole } from '../../generated/prisma';

@Injectable()
export class GardenService {
  constructor(
    private gardenRepository: GardenRepository,
    private woodService: WoodService,
    private errorService: ErrorService,
  ) {}

  async create(payload: CreateGardenDto): Promise<IGardenResponse> {
    const { woods = [], ...gardenData } = payload;

    if (woods.length > 0) {
      const ids = woods.map((w) => w.woodId);
      await this.woodService.validateWoodsbyIds(ids);
    }

    const garden = await this.gardenRepository.createGarden(
      {
        ...gardenData,
        ...(woods.length !== 0 && {
          woods: {
            createMany: {
              data: woods,
            },
          },
        }),
      },
      {
        ...this.gardenSelectOptions,
        ...this.gardenWoodsSelectOptions,
      },
    );

    const totalWoodsQuantity =
      await this.gardenRepository.getTotalQuantityByGardenId(garden.id);

    return this.toGardenResponse(garden, totalWoodsQuantity);
  }

  async findAll(auth: IAuth) {
    const whereOptions = auth.role !== UserRole.ADMIN ? { isActive: true } : {};
    const gardens = await this.gardenRepository.getGardens(
      {
        ...this.gardenSelectOptions,
        ...this.gardenWoodsSelectOptions,
      },
      whereOptions,
    );

    const gardenIds = gardens.map((garden) => garden.id);

    const totalWoodsQuantity =
      await this.gardenRepository.getTotalQuantityByGardenIds(gardenIds);

    return gardens.map((garden) =>
      this.toGardenResponse(garden, totalWoodsQuantity),
    );
  }

  async findOne(auth: IAuth, id: number): Promise<IGardenResponse> {
    const garden = await this.gardenRepository.getGardenById(id, {
      ...this.gardenSelectOptions,
      ...this.gardenWoodsSelectOptions,
    });

    if (!garden || (auth.role !== UserRole.ADMIN && !garden.isActive))
      this.errorService.notFound('Kendaraan Tidak Ditemukan');

    const totalWoodsQuantity =
      await this.gardenRepository.getTotalQuantityByGardenId(garden.id);

    return this.toGardenResponse(garden, totalWoodsQuantity);
  }

  async update(id: number, payload: UpdateGardenDto): Promise<IGardenResponse> {
    const countGarden = await this.gardenRepository.countGardenById(id);

    if (countGarden === 0) {
      await this.errorService.notFound('Kebun Tidak Ditemukan');
    }

    const garden = await this.gardenRepository.updateGardenById(id, payload, {
      ...this.gardenSelectOptions,
      ...this.gardenWoodsSelectOptions,
    });

    const totalWoodsQuantity =
      await this.gardenRepository.getTotalQuantityByGardenId(garden.id);

    return this.toGardenResponse(garden, totalWoodsQuantity);
  }

  async remove(id: number): Promise<void> {
    const countGarden = await this.gardenRepository.countGardenById(id);

    if (countGarden === 0) {
      await this.errorService.notFound('Kebun Tidak Ditemukan');
    }

    await this.gardenRepository.updateGardenById(
      id,
      {
        isActive: false,
      },
      {
        id: true,
      },
    );
  }

  private gardenSelectOptions = {
    id: true,
    name: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  private gardenWoodsSelectOptions = {
    woods: {
      select: {
        wood: {
          select: this.woodService.woodSelectOptions,
        },
        quantity: true,
      },
    },
  };

  toGardenResponse(
    garden: IGardenResult,
    totalQuantity?: number | { gardenId: number; totalQuantity: number }[],
  ) {
    const { woods: woodsResult = [], ...gardenResult } = garden;

    const totalWoodsQuantity =
      typeof totalQuantity === 'number'
        ? totalQuantity
        : (totalQuantity?.find((q) => q.gardenId === garden.id)
            ?.totalQuantity ?? 0);

    return {
      ...gardenResult,
      totalWoodsQuantity,
      woods: woodsResult?.map((w) => ({
        ...this.woodService.toWoodResponse(w.wood),
        quantity: w.quantity,
      })),
    };
  }
}
